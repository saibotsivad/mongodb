import { post } from 'httpie'
import { mongodb } from './src/index.js'

/**
 * A small shim to make `httpie` behave closer to `fetch`.
 * @param {Object} response - The response from the `httpie` POST request.
 * @return {{ json: function(): Promise<Object>, text: function(): Promise<String>, status: number }} - The `fetch`-like response object.
 */
const postFetchShim = response => ({
	status: response.statusCode,
	headers: response.headers,
	json: async () => {
		// There is a bug with the Data API where it returns the `Content-Type` header
		// as `text/plain` for JSON bodies, and then `httpie` correctly translates the body
		// to a string. I'm trying to raise an issue with the @MongoDBDev team, so I'll
		// see if that gets anywhere...
		if (typeof response.data === 'string' && response.data.startsWith('{')) return JSON.parse(response.data)
		return response.data
	},
	text: async () => response.data,
})

const CLUSTER_NAME = 'Cluster0'
const DB_NAME = 'TestDatabase'
const COLL_NAME = 'TestCollection'

const db = mongodb({
	apiKey: process.env.MONGODB_API_KEY,
	apiId: 'data-iiuud',
	cluster: CLUSTER_NAME,
	database: DB_NAME,
	collection: COLL_NAME,
	fetch: async (url, parameters) => post(url, parameters).then(postFetchShim, postFetchShim),
})

db
	.insertMany({ documents: [{ name: 'Bilbo Baggins' }] })
	// .insertOne({ document: { _id: '1P', name: 'Bilbo Baggins' } })
	// .find({ filter: { name: 'Bilbo Baggins' } })
	// .find({ filter: { _id: '1P' } })
	// .findOne({ filter: { _id: '1P' } })
	.then(response => {
		console.log(response)
	})
	.catch(error => {
		console.error(error)
	})
