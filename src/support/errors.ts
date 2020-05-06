export class HTTPError extends Error {
	constructor(
		public url: string,
		public status: number,
		public statusText: string,
		public body?: any
	) {
		super(`${status}: ${statusText}`);
	}
}