# @saibotsivad/mongodb

Simple wrapper for the [MongoDB Data API](https://docs.atlas.mongodb.com/api/data-api/).

> **v1 Update!** MongoDB is out of beta, so this library is now v1! 🎉

## Install

The usual ways:

```shell
npm install @saibotsivad/mongodb
```

## Example

Instantiate and issue a request:

```js
import { mongodb } from '@saibotsivad/mongodb'

const db = mongodb({
	apiKey: 'AKAIDEXAMPLEKEY',
	apiUrl: 'https://data.mongodb-api.com/app/data-abc123/endpoint/data/v1',
	dataSource: 'myCluster3',
	database: 'myDatabase',
	collection: 'vehicles',
})

const car = await db.findOne({ filter: { type: 'car' } })
// => { _id: "61df...", type: "car", ...etc }
```

## Instantiate

Import the `{ mongodb }` function and instantiate with the following properties:

#### `apiKey: string` **(always required)**

The programmatic API key, generated using the MongoDB Atlas interface.

#### `apiUrl: string` **(always required)**

The fully qualified URL, e.g. something like this:

```
https://data.mongodb-api.com/app/data-abc123/endpoint/data/v1
```

## Request Requirements

These are properties that are **required** for every request.

You can set them when you create a `mongodb` instance, or override or provide them on the individual request:

```js
const db = mongodb({
	apiKey: 'AKAIDEXAMPLEKEY',
	apiUrl: 'https://data.mongodb-api.com/app/data-abc123/endpoint/data/v1',
	dataSource: 'myCluster1',
	database: 'myDatabase',
	collection: 'vehicles',
})

// override `collection` for this one request
const car = await db.findOne({ filter: { type: 'hobbit' } }, { collection: 'people' })
// => { _id: "42fd...", type: "hobbit", ...etc }
```

#### `dataSource: string`

The name of the MongoDB cluster.

#### `database: string`

The name of the MongoDB database.

#### `collection: string`

The name of the collection.

## Environment Specific

#### `fetch: function`

This library was written to use the [`fetch` Web API](https://developer.mozilla.org/en-US/docs/Web/API/fetch) using `globalThis.fetch` to make requests to the MongoDB Data API.

To make requests in an environment *without* `fetch`, e.g. NodeJS, you will need to provide your own fetch-like implementation.

Check [the response type definition](./index.d.ts) for interface requirements, but for example you could use something like the very lightweight [`httpie`](https://github.com/lukeed/httpie/) library, like in [the demo](./demo/fetch-shim.js).

## Methods

The available methods follow the [Data API Resources](https://docs.atlas.mongodb.com/api/data-api-resources/) exactly, so go read those for more details.

Each one can be overridden with a second property, which is an object containing the earlier "Request Requirements" properties, e.g.:

```js
await db.findOne(
	{ filter: { type: 'car' } },
	{
		dataSource: 'AlternateCluster',
		database: 'AlternateDatabase',
		collection: 'AlternateTable',
	},
)
```

### aggregate

[Runs an aggregation pipeline](https://docs.atlas.mongodb.com/api/data-api-resources/#run-an-aggregation-pipeline) and returns the result set of the final stage of the pipeline as an array of documents.

```ts
(
	parameters: { pipeline: MongoPipeline },
	overrides?: { dataSource?: string, database?: string, collection?: string },
) =>
	Promise<{ documents: Array<Object> }>
```

```js
await db.aggregate({
	pipeline: [
		{
			$group: {
				_id: "$status",
				count: { $sum: 1 },
				text: { $push: "$text" }
			}
		},
		{ $sort: { count: 1 } }
	]
})
// => { documents [{ _id: ... }] }
```

### deleteOne

[Delete the first document](https://docs.atlas.mongodb.com/api/data-api-resources/#delete-a-single-document) matching the filter, and return the number of documents deleted.

```ts
(
	parameters: { filter: MongoFilter },
	overrides?: { dataSource?: string, database?: string, collection?: string },
) =>
	Promise<{ deletedCount: Number }>
```

```js
await db.deleteOne({
	filter: { _id: { $oid: '6193ebd53821e5ec5b4f6c3b' } }
})
// => { deletedCount: 1 }
```

### deleteMany

[Delete multiple documents](https://docs.atlas.mongodb.com/api/data-api-resources/#delete-multiple-documents) and return the number of documents deleted.

```ts
(
	parameters: { filter: MongoFilter },
	overrides?: { dataSource?: string, database?: string, collection?: string },
) =>
	Promise<{ deletedCount: Number }>
```

```js
await db.deleteMany({
	filter: { status: 'complete' }
})
// => { deletedCount: 7 }
```

### find

[Find multiple documents](https://docs.atlas.mongodb.com/api/data-api-resources/#find-multiple-documents) and return a list of those documents.

```ts
(
	parameters: { filter: MongoFilter, projection: MongoProjection, sort: MongoSort, limit: Integer, skip: Integer },
	overrides?: { dataSource?: string, database?: string, collection?: string },
) =>
	Promise<{ documents: Array<Object> }>
```

```js
await db.find({
	filter: { status: 'complete' },
	sort: { completedAt: -1 }
})
// => { documents: [{ _id: ... }] }
```

### findOne

[Find and return the first document matching the filter](https://docs.atlas.mongodb.com/api/data-api-resources/#find-a-single-document).

```ts
(
	parameters: { filter: MongoFilter, projection: MongoProjection },
	overrides?: { dataSource?: string, database?: string, collection?: string },
) =>
	Promise<{ document: Object }>
```

```js
await db.findOne({ filter: { _id: { $oid: '6193ebd53821e5ec5b4f6c3b' } } })
// => { document: { _id: ... } }
```

### insertOne

[Insert a single document](https://docs.atlas.mongodb.com/api/data-api-resources/#insert-a-single-document) and return the ID of that document.

```ts
(
	parameters: { document: EjsonDocument },
	overrides?: { dataSource?: string, database?: string, collection?: string },
) =>
	Promise<{ insertedId: String }>
```

```js
await db.insertOne({ document: { type: 'car' } })
// => { insertedId: '61935189ec53247016a623c9' }
```

### insertMany

[Insert multiple documents at once](https://docs.atlas.mongodb.com/api/data-api-resources/#insert-multiple-documents) and return the generated IDs.

```ts
(
	parameters: { documents: Array<EjsonDocument> },
	overrides?: { dataSource?: string, database?: string, collection?: string },
) =>
	Promise<{ insertedIds: Array<String> }>
```

```js
await db.insertMany({
	documents: [
		{ type: 'car' },
		{ type: 'truck' }
	]
})
// => { insertedIds: [ '61935189ec53247016a623c9', '61935189ec53247016a623ca' ] }
```

### replaceOne

[Replace or upsert the first document matching the filter](https://docs.atlas.mongodb.com/api/data-api-resources/#replace-a-single-document) and return the matched and modified count, along with the generated ID if a new document was generated.

```ts
(
	parameters: { filter: MongoFilter, replacement: EjsonDocument, upsert: Boolean },
	overrides?: { dataSource?: string, database?: string, collection?: string },
) =>
	Promise<{ matchedCount: Integer, modifiedCount: Integer, upsertedId?: String }>
 ```

```js
await db.replaceOne({
	filter: { id: { $oid: '61935189ec53247016a623c9' } },
	replacement: { type: 'van' }
})
// => { matchedCount: 1, modifiedCount: 1, upsertedId: '...' }
```

### updateOne

[Update the first document matching the filter](https://docs.atlas.mongodb.com/api/data-api-resources/#update-a-single-document) and return the matched and modified count, along with the generated ID if a new document was generated.

```ts
(
	parameters: { filter: MongoFilter, update: MongoUpdate, upsert: Boolean },
	overrides?: { dataSource?: string, database?: string, collection?: string },
) =>
	Promise<{ matchedCount: Integer, modifiedCount: Integer, upsertedId?: String }>
 ```

```js
await db.updateOne({
	filter: { id: { $oid: '61935189ec53247016a623c9' } },
	update: {
		$set: {
			status: 'complete',
			completedAt: { $date: { $numberLong: Date.now().toString() } }
		}
	}
})
// => { matchedCount: 1, modifiedCount: 1, upsertedId: '...' }
```

### updateMany

[Update all documents matching the filter](https://docs.atlas.mongodb.com/api/data-api-resources/#update-multiple-documents) and return the matched and modified count, along with the generated ID if a new document was generated.

```ts
(
	parameters: { filter: MongoFilter, update: MongoUpdate, upsert: Boolean },
	overrides?: { dataSource?: string, database?: string, collection?: string },
) =>
	Promise<{ matchedCount: Integer, modifiedCount: Integer, upsertedId?: String }>
 ```

```js
await db.updateOne({
	filter: { status: 'open' },
	update: {
		$set: {
			status: 'complete',
			completedAt: { $date: { $numberLong: Date.now().toString() } }
		}
	}
})
// => { matchedCount: 7, modifiedCount: 4 }
```

## License

Published and released under the [Very Open License](http://veryopenlicense.com).

If you need a commercial license, [contact me here](https://davistobias.com/license?software=mongodb).
