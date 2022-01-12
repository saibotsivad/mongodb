const upsertable = upsert => res => ({
	matchedCount: res.matchedCount,
	modifiedCount: res.modifiedCount,
	upsertedId: upsert && res.upsertedId,
})

class MongoError extends Error {
	constructor({ error, error_code, link }) {
		super(error)
		this.code = error_code
		this.link = link
	}
}

export const mongodb = ({
	apiKey,
	apiId,
	apiRegion,
	apiUrl,
	cluster,
	database,
	collection,
	fetch = globalThis.fetch,
}) => {
	if (!apiUrl && !apiId || !apiKey || !cluster || !database) throw new Error('Either the `apiUrl` or `apiId` must be set. The `apiKey`, `cluster`, and `database` must always be set.')
	const url = apiUrl || `https://${apiRegion || 'data'}.mongodb-api.com/app/${apiId}/endpoint/data/beta`

	const request = async (name, parameters, overrides) => {
		if (!collection && !overrides?.collection) throw new Error('Collection name must be set on instantiation or each request.')
		let result
		try {
			result = await fetch(url + '/action/' + name, {
				headers: {
					'content-type': 'application/json',
					'access-control-request-headers': '*',
					'api-key': apiKey,
				},
				body: JSON.stringify({
					dataSource: cluster,
					database: database,
					collection: overrides?.collection || collection,
					parameters,
				}),
			})
		} catch (error) {
			result = error
		}
		if (typeof result.data === 'string') result.data = JSON.parse(result.data)
		if (result.statusCode !== 200) throw new MongoError(result.data)
		return result.data
	}

	return {
		aggregate: async pipeline => request('aggregate', { pipeline }).then(res => res.documents),
		deleteOne: async ({ filter }) => request('deleteOne', { filter }).then(res => res.deletedCount),
		deleteMany: async ({ filter }) => request('deleteMany', { filter }).then(res => res.deletedCount),
		find: async ({ filter, projection, sort, limit, skip }) => request('find', {
			filter,
			projection,
			sort,
			limit,
			skip,
		}).then(res => res.documents),
		findOne: async ({ filter, projection }, overrides) => request('findOne', {
			filter,
			projection,
		}, overrides).then(res => res.document),
		insertOne: async ejsonDocument => request('insertOne', { document: ejsonDocument }).then(res => res.insertedId),
		insertMany: async ejsonDocuments => request('insertMany', { documents: ejsonDocuments }).then(res => res.insertedIds),
		replaceOne: async ({ filter, replacement, upsert }) => request('replaceOne', {
			filter,
			replacement,
			upsert,
		}).then(upsertable(upsert)),
		updateOne: async ({ filter, update, upsert }) => request('updateOne', {
			filter,
			update,
			upsert,
		}).then(upsertable(upsert)),
		updateMany: async ({ filter, update, upsert }) => request('updateMany', {
			filter,
			update,
			upsert,
		}).then(upsertable(upsert)),
	}
}
