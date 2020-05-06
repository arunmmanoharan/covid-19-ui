import { HTTPError } from '../support/errors';

const API_BASE = 'http://localhost:8888';

const request = async(path: string, options?: RequestInit) => {

	options = { ...options };

	const url = `${API_BASE}${path}`;
	const response = await fetch(url, options);

	if (!response.ok) {
		let body;
		try {
			body = await response.json();
		} catch {
			// Ignore a failure to parse the response
		}

		throw new HTTPError(url, response.status, response.statusText, body);
	}

	return response;
}

export const load  = async(path: string) => {
	const response = await request(path);
	return await response.json();
}

export const create = async (path: string, payload: object) => {
	const response = await request(path, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	return await response.json();
}

export const update = create;

export const remove = async (path: string) => {
	await request(path, {
		method: 'DELETE',
	});
}