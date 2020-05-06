export type Needs<T> = { [P in keyof T]: string };

export interface Subscription {
	cancel(): void;
}

export interface Summary<T> {
	loading: boolean;
	errors: Error[];
	data: Partial<T>;
}

interface InternalSubscription {
	id: number;
	callback: () => void;
	paths: string[];
}

interface CacheRecord {
	loading: boolean;
	error?: Error;
	data?: any;
}

export type Loader = (path: string) => Promise<any>;

class APICache {
	private counter = 0;
	private cache = new Map<string, CacheRecord>();
	private subscriptions = new Map<number, InternalSubscription>();
	private readonly loader: Loader;

	constructor(loader: Loader) {
		this.loader = loader;
	}

	public subscribe(paths: string[], callback: () => void): Subscription {
		const id = this.counter++;

		const subscription = {
			id,
			callback,
			paths,
		};

		this.subscriptions.set(id, subscription);

		return {
			cancel: () => {
				this.subscriptions.delete(id);
			},
		};
	}

	public load(paths: string[], force: boolean = false): Promise<any[]> {
		return Promise.all(
			paths.map(async path => {
				if (this.cache.has(path) && !force) {
					return;
				}

				const entry = this.cache.get(path); // Retain old data on reload
				this.set(path, { loading: true, data: entry && entry.data });

				try {
					const data = await this.loader(path);
					this.set(path, { loading: false, data });
					return data;
				} catch (error) {
					this.set(path, { loading: false, error });
					return undefined;
				}
			})
		);
	}

	public summarize<T>(needs: Needs<T>): Summary<T> {
		let loading = false;
		const errors: Error[] = [];
		const data: Partial<T> = {};

		for (const key in needs) {
			if ({}.hasOwnProperty.call(needs, key)) {
				const path = needs[key];

				const record = this.cache.get(path);
				if (record === undefined) {
					loading = true;
					continue;
				}

				loading = loading || record.loading;

				if (record.error) {
					errors.push(record.error);
				}

				data[key] = record.data;
			}
		}

		return { loading, errors, data };
	}

	private set(path: string, record: CacheRecord) {
		this.cache.set(path, record);
		this.emit(path);
	}

	private emit(path: string) {
		this.subscriptions.forEach((subscription, id) => {
			const { callback, paths } = subscription;

			if (paths.indexOf(path) >= 0) {
				callback();
			}
		});
	}
}

export default APICache;