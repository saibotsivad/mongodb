import { post } from 'httpie'

/**
 * A small shim to make `httpie` behave more like `fetch`.
 *
 * @param {{ statusCode: number, headers: Map<string, string>, data: string }} response - The response from the `httpie` POST request.
 * @return {{ json: function(): Promise<Object>, text: function(): Promise<String>, status: number }} - The `fetch`-like response object.
 */
const postFetchShim = response => ({
	status: response.statusCode,
	headers: response.headers,
	json: async () => response.data,
	text: async () => response.data,
})

export const fetch = async (url, parameters) => post(url, parameters).then(postFetchShim, postFetchShim)
