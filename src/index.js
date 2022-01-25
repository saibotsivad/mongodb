export function mongodb({
	apiKey,
	apiId,
	apiRegion,
	apiUrl,
	cluster,
	database,
	collection,
	fetch = globalThis.fetch,
}) {
	if (!apiUrl && !apiId || !apiKey || !cluster || !database) throw new Error('Either the `apiUrl` or `apiId` must be set. The `apiKey`, `cluster`, and `database` must always be set.')
	const url = apiUrl || `https://${apiRegion || 'data'}.mongodb-api.com/app/${apiId}/endpoint/data/beta`

	const request = async (name, parameters, overrides) => {
		if (!collection && !overrides?.collection) throw new Error('Collection name must be set on instantiation or each request.')
		const response = await fetch(url + '/action/' + name, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'access-control-request-headers': '*',
				'api-key': apiKey,
			},
			body: JSON.stringify({
				dataSource: cluster,
				database: database,
				collection: overrides?.collection || collection,
				...(parameters || {}),
			}),
		})
		// If the response was a success, the body will be JSON, otherwise... it
		// sometimes is JSON, sometimes text... the Data API is still in Beta, so
		// please do raise in issue on Github if anything stabilizes.
		const status = response.status || response.statusCode || 500
		if (status === 200 || status === 201) {
			return response.json()
		} else {
			let error = await response.text()
			if (error.includes('{')) {
				try {
					error = JSON.parse(error)
				} catch (ignore) {
					// not valid JSON
					error = { error, status }
				}
			} else {
				// also not valid JSON
				error = { error, status }
			}
			return Promise.reject(error)
		}
	}

	return {
		/**
		 * Runs an aggregation pipeline and returns the result set of the final stage of the pipeline
		 * as an array of documents.
		 * @param {Object} parameters - The request parameters.
		 * @param {Object} parameters.pipeline - The MongoDB pipeline array.
		 * @param {Object} [overrides] - Overrides specific to this request.
		 * @return {Promise<{ documents: Array<Object> }>} - The returned list of documents.
		 */
		aggregate: async ({ pipeline }, overrides) => request('aggregate', { pipeline }, overrides),

		/**
		 * Delete the first document matching the filter, and return the number of documents deleted.
		 * @param {Object} parameters - The request parameters.
		 * @param {Object} parameters.filter - The MongoDB filter object.
		 * @param {Object} [overrides] - Overrides specific to this request.
		 * @return {Promise<{ deletedCount: Number }>} - The number of documents deleted.
		 */
		deleteOne: async ({ filter }, overrides) => request('deleteOne', { filter }, overrides),

		/**
		 * Delete all documents matching the filter, and return the number of documents deleted.
		 * @param {Object} parameters - The request parameters.
		 * @param {Object} parameters.filter - The MongoDB filter object.
		 * @param {Object} [overrides] - Overrides specific to this request.
		 * @return {Promise<{ deletedCount: Number }>} - The number of documents deleted.
		 */
		deleteMany: async ({ filter }, overrides) => request('deleteMany', { filter }, overrides),

		/**
		 * Find and return a list of documents.
		 * @param {Object} parameters - The request parameters.
		 * @param {Object} [parameters.filter] - The MongoDB filter object.
		 * @param {Object} [parameters.projection] - The MongoDB projection object.
		 * @param {Object} [parameters.sort] - The MongoDB sort object, e.g. `{ completed: -1 }`.
		 * @param {Number} [parameters.limit] - The maximum number of documents to return.
		 * @param {Number} [parameters.skip] - The number of documents to skip, aka the cursor position.
		 * @param {Object} [overrides] - Overrides specific to this request.
		 * @return {Promise<{ documents: Array<Object> }>} - The documents matching the parameters.
		 */
		find: async ({ filter, projection, sort, limit, skip }, overrides) => request('find', {
			filter,
			projection,
			sort,
			limit,
			skip,
		}, overrides),

		/**
		 * Find and return the first document matching the filter.
		 * @param {Object} parameters - The request parameters.
		 * @param {Object} [parameters.filter] - The MongoDB filter object.
		 * @param {Object} [parameters.projection] - The MongoDB projection object.
		 * @param {Object} [overrides] - Overrides specific to this request.
		 * @return {Promise<{ document: Object }>} - The document matching the parameters.
		 */
		findOne: async ({ filter, projection }, overrides) => request('findOne', {
			filter,
			projection,
		}, overrides),

		/**
		 * Insert a single document. Must be an EJSON document.
		 * @param {Object} parameters - The request parameters.
		 * @param {Object} parameters.document - The EJSON document to insert.
		 * @param {Object} [overrides] - Overrides specific to this request.
		 * @return {Promise<{ insertedId: String }>} - The identifier of the inserted document.
		 */
		insertOne: async ({ document }, overrides) => request('insertOne', { document }, overrides),

		/**
		 * Insert multiple documents at once. Must be EJSON documents.
		 * @param {Object} parameters - The request parameters.
		 * @param {Object} parameters.documents - The EJSON documents to insert.
		 * @param {Object} [overrides] - Overrides specific to this request.
		 * @return {Promise<{ insertedIds: Array<String> }>} - The identifiers of the inserted document.
		 */
		insertMany: async ({ documents }, overrides) => request('insertMany', { documents }, overrides),

		/**
		 * Replace or upsert a single document. Must be an EJSON document.
		 * @param {Object} parameters - The request parameters.
		 * @param {Object} parameters.filter - The MongoDB filter object.
		 * @param {Object} parameters.replacement - The EJSON document to replace or upsert.
		 * @param {Boolean} [parameters.upsert] - If set to true, it will insert the `replacement` document if no documents match the `filter`.
		 * @param {Object} [overrides] - Overrides specific to this request.
		 * @return {Promise<{ matchedCount: Number, modifiedCount: Number, upsertedId: String }>} - The request results.
		 */
		replaceOne: async ({ filter, replacement, upsert }, overrides) => request('replaceOne', {
			filter,
			replacement,
			upsert,
		}, overrides),

		/**
		 * Update or upsert a single document. Must be an EJSON document.
		 * @param {Object} parameters - The request parameters.
		 * @param {Object} parameters.filter - The MongoDB filter object.
		 * @param {Object} parameters.update - The EJSON document to update or upsert.
		 * @param {Boolean} [parameters.upsert] - If set to true, it will insert the `replacement` document if no documents match the `filter`.
		 * @param {Object} [overrides] - Overrides specific to this request.
		 * @return {Promise<{ matchedCount: Number, modifiedCount: Number, upsertedId: String }>} - The request results.
		 */
		updateOne: async ({ filter, update, upsert }, overrides) => request('updateOne', {
			filter,
			update,
			upsert,
		}, overrides),

		/**
		 * Update many documents or upsert a single document. Must be an EJSON document.
		 * @param {Object} parameters - The request parameters.
		 * @param {Object} parameters.filter - The MongoDB filter object.
		 * @param {Object} parameters.update - The EJSON document to update or upsert.
		 * @param {Boolean} [parameters.upsert] - If set to true, it will insert the `replacement` document if no documents match the `filter`.
		 * @param {Object} [overrides] - Overrides specific to this request.
		 * @return {Promise<{ matchedCount: Number, modifiedCount: Number, upsertedId: String }>} - The request results.
		 */
		updateMany: async ({ filter, update, upsert }, overrides) => request('updateMany', {
			filter,
			update,
			upsert,
		}, overrides),
	}
}
