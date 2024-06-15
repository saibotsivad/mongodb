import assert from 'node:assert/strict'

import { mongodb } from '../dist/index.mjs'
import { fetch } from './fetch-shim.js'

const nodeVersion = process.version

const apiUrl = process.env.MONGODB_API_URL
const apiKey = process.env.MONGODB_API_KEY
const dataSource = process.env.MONGODB_CLUSTER_NAME
const database = process.env.MONGODB_DATABASE_NAME
const collection = process.env.MONGODB_COLLECTION_NAME

const withBadApiKey = mongodb({
	apiUrl,
	apiKey: 'battery-horse-staple',
	dataSource,
	database,
	collection,
	fetch,
})
await assert.rejects(
	async () => withBadApiKey.find({ filter: {} }),
	error => {
		assert.equal(error.name, 'MongodbError')
		assert.equal(error.title, 'InvalidSession')
		return true
	},
)

const withGoodKeyButBadRequest = mongodb({
	apiUrl,
	apiKey,
	dataSource,
	database,
	collection,
	fetch,
})
await assert.rejects(
	async () => withGoodKeyButBadRequest.find({ filter: { $the_hobbits_the_hobbits: 'to isengard' } }),
	error => {
		assert.equal(error.name, 'MongodbError')
		assert.ok(error.message.includes('unknown top level operator'))
		return true
	},
)

const differentWaysToInitialize = [
	{
		description: 'With no options.',
		success: false,
		initialize: () => mongodb({}),
	},
	{
		description: 'With a URL but no API key.',
		success: false,
		initialize: () => mongodb({
			apiUrl,
			fetch,
		}),
	},
	{
		description: 'With an API key and no URL.',
		success: false,
		initialize: () => mongodb({
			apiKey,
			fetch,
		}),
	},
	{
		description: 'With an API key and URL.',
		success: true,
		initialize: () => mongodb({
			apiKey,
			apiUrl,
			fetch,
		}),
	},
]

console.log('These are the different valid ways to initialize:')
for (const { description, success, initialize } of differentWaysToInitialize) {
	console.log('-', description)
	try {
		initialize()
		if (!success) assert.fail(description)
	} catch (error) {
		if (success) {
			console.error(error)
			assert.fail(description)
		}
	}
}

const goodDefaults = { apiKey, apiUrl, fetch }
const differentWaysToSetRequestParams = [
	{
		description: 'All parameters are set at default.',
		success: true,
		initialize: () => mongodb({
			...goodDefaults,
			dataSource,
			database,
			collection,
		}),
		overrides: {
			// None
		},
	},
	{
		description: 'None of the required parameters are provided.',
		success: false,
		initialize: () => mongodb({
			...goodDefaults,
		}),
		overrides: {
			// None
		},
	},
	{
		description: 'All parameters are overridden.',
		success: true,
		initialize: () => mongodb({
			...goodDefaults,
			dataSource: 'BAD',
			database: 'BAD',
			collection: 'BAD',
		}),
		overrides: {
			// The good ones
			dataSource,
			database,
			collection,
		},
	},
]

const db = mongodb({
	apiKey,
	apiUrl,
	dataSource,
	database,
	collection,
	fetch,
})

console.log('These are the different ways you can set request params on the initializer:')
for (const { description, success, initialize, overrides } of differentWaysToSetRequestParams) {
	console.log('-', description)
	let testingDb
	try {
		testingDb = initialize()
	} catch (error) {
		console.error(error)
		assert.fail(description)
	}
	let result
	try {
		result = await testingDb.insertOne({ document: { description, nodeVersion } }, overrides)
	} catch (error) {
		if (success) {
			console.error(error)
			assert.fail(description)
		}
	}
	// Cleanup after the test
	if (success) {
		const { deletedCount } = await db.deleteOne({ filter: { _id: { $oid: result.insertedId } } })
		if (deletedCount !== 1) assert.fail('Failed to remove document: ' + result.insertedId)
	}
}

console.log('Now testing out all methods.')

console.log('db.insertOne')
const { insertedId } = await db.insertOne({
	document: {
		name: 'Bilbo Baggins',
		nodeVersion,
	},
})
assert.ok(insertedId, 'The document was correctly inserted.')
console.log('Inserted ID:', insertedId)

console.log('db.findOne')
const out1 = await db.findOne({
	filter: {
		_id: { $oid: insertedId },
	},
})
assert.equal(out1.document._id, insertedId, 'It should be found.')

console.log('db.deleteOne')
const out2 = await db.deleteOne({
	filter: {
		_id: { $oid: insertedId },
	},
})
assert.equal(out2.deletedCount, 1, 'Deleted the document.')

console.log('db.insertMany')
const { insertedIds } = await db.insertMany({
	documents: [
		{
			name: 'Bilbo Baggins',
			type: 'hobbit',
			nodeVersion,
		},
		{
			name: 'Samwise Gamgee',
			type: 'hobbit',
			nodeVersion,
		},
	],
})
assert.equal(insertedIds.length, 2, 'The two documents were correctly inserted.')

console.log('db.find')
const { documents } = await db.find({
	filter: {
		type: 'hobbit',
		nodeVersion,
	},
})
assert.equal(documents.length, 2, 'Found both documents')

console.log('db.updateOne')
const out3 = await db.updateOne({
	filter: {
		_id: { $oid: documents[0]._id },
	},
	update: {
		$set: { pipe: true },
	},
})
assert.equal(out3.matchedCount, 1)
assert.equal(out3.modifiedCount, 1)

console.log('db.updateMany')
const out4 = await db.updateMany({
	filter: {
		type: 'hobbit',
		nodeVersion,
	},
	update: {
		$set: { teaTime: true },
	},
})
assert.equal(out4.matchedCount, 2)
assert.equal(out4.modifiedCount, 2)

console.log('db.replaceOne')
const { documents: updatedHobbits } = await db.find({
	filter: {
		type: 'hobbit',
		name: 'Bilbo Baggins',
		nodeVersion,
	},
})
assert.equal(updatedHobbits.length, 1, 'Found one document')
updatedHobbits[0].age = '111'
delete updatedHobbits[0]._id
const out5 = await db.replaceOne({
	filter: {
		_id: updatedHobbits[0]._id,
	},
	replacement: updatedHobbits[0],
})
assert.equal(out5.matchedCount, 1)
assert.equal(out5.modifiedCount, 1)

console.log('db.aggregate')
const out6 = await db.aggregate({
	pipeline: [
		{
			$match: { type: 'hobbit', nodeVersion },
		},
		{
			$sort: { name: 1 },
		},
	],
})
assert.equal(out6.documents.length, 2)
delete out6.documents[0]._id
delete out6.documents[1]._id
assert.deepStrictEqual(
	out6.documents[0],
	{
		name: 'Bilbo Baggins',
		type: 'hobbit',
		nodeVersion,
		pipe: true,
		teaTime: true,
		age: '111',
	},
)
assert.deepStrictEqual(
	out6.documents[1],
	{
		name: 'Samwise Gamgee',
		type: 'hobbit',
		nodeVersion,
		teaTime: true,
	},
)

console.log('The "interpose" function.')
const currentDate = new Date().toISOString()
const interposeDb = mongodb({
	apiKey,
	apiUrl,
	dataSource: 'BAD',
	database: 'BAD',
	collection: 'BAD',
	fetch,
	interpose: ({ name, body }) => {
		assert.equal(name, 'findOne')
		delete body.projection
		assert.deepStrictEqual(
			body,
			{
				filter: { currentDate, nodeVersion },
				dataSource: 'BAD',
				database: 'BAD',
				collection: 'BAD',
			},
			'it has the bad request',
		)
		// You can return whatever you want and totally mutate everything.
		return {
			body: {
				filter: { name: 'Bilbo Baggins' },
				// use the good ones again
				dataSource,
				database,
				collection,
			},
		}
	},
})
const interposed = await interposeDb.findOne({ filter: { currentDate, nodeVersion } })
assert.equal(interposed.document.type, 'hobbit', 'original query would not have found it but modified did')

console.log('db.deleteMany')
const out99 = await db.deleteMany({
	filter: {
		type: 'hobbit',
		nodeVersion,
	},
})
assert.equal(out99.deletedCount, 2, 'Deleted both documents.')

const shouldBeEmpty = await db.find({ filter: { nodeVersion } })
assert.equal(shouldBeEmpty.documents.length, 0)
