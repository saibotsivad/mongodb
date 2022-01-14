# @saibotsivad/mongodb

Simple wrapper for the [MongoDB Data API](https://docs.atlas.mongodb.com/api/data-api/).

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
	apiId: 'my-assigned-id',
	cluster: 'myCluster3',
	database: 'myDatabase',
	collection: 'vehicles',
	fetch: globalThis.fetch
	// or e.g. `import { post } from 'httpie'` and then `fetch: post`
})

const car = await db.findOne({ filter: { type: 'car' } })
// => { _id: "61df...", type: "car", ...etc }
```

## Instantiate

Import the `{ mongodb }` function and instantiate with the following properties:

* `apiKey: string` *(always required)* - The programmatic API key, generated in the MongoDB Atlas interface.
* `apiId: string` - The "Data API App ID", which is an identifier unique to each cluster.
* `apiRegion: string` - Constrain the request to a specific API region, e.g. `us-east-1`. (Default: `data`)
* `apiUrl: string` - Specify the fully qualified URL prefix, e.g. `https://data.mongodb-api.com/app/my-id/endpoint/data/beta`.
* `cluster: string` - The name of the MongoDB cluster.
* `database: string` - The name of the MongoDB database.
* `collection: string` - The name of the collection to use for all requests, unless overridden.
* `fetch: function` - The function used to make the POST requests. (Default: `globalThis.fetch`)

Notes:

- Either the `apiUrl` or `apiId` are **required** on instantiation.
- The `collection` can either be set at the instantiation level, or on each request, e.g. `db.findOne({ filter }, { collection: 'other-collection' })`.

## Methods

The available methods follow the [Data API Resources](https://docs.atlas.mongodb.com/api/data-api-resources/) exactly, so go read those for more details.

Each one can be overridden with a second property, which is an object containing the following properties:

* `collection: string` - The name of the collection to use for this specific request.

```js
await db.findOne(
	{ filter: { type: 'car' } },
	{ collection: 'AlternateTable' }
)
```

### aggregate

[Runs an aggregation pipeline](https://docs.atlas.mongodb.com/api/data-api-resources/#run-an-aggregation-pipeline) and returns the result set of the final stage of the pipeline as an array of documents.

```ts
(
	{ pipeline: MongoPipeline },
	overrides?: { collection?: string }
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
```

### deleteOne

[Delete the first document](https://docs.atlas.mongodb.com/api/data-api-resources/#delete-a-single-document) matching the filter, and return the number of documents deleted.

```ts
(
	{ filter: MongoFilter },
	overrides?: { collection?: string }
) =>
	Promise<{ deletedCount: Number }>
```

```js
await db.deleteOne({
	filter: { _id: { $oid: '6193ebd53821e5ec5b4f6c3b' } }
})
```

### deleteMany

[Delete multiple documents](https://docs.atlas.mongodb.com/api/data-api-resources/#delete-multiple-documents) and return the number of documents deleted.

```ts
(
	{ filter: MongoFilter },
	overrides?: { collection?: string }
) =>
	Promise<{ deletedCount: Number }>
```

```js
await db.deleteMany({
	filter: { status: 'complete' }
})
```

### find

[Find multiple documents](https://docs.atlas.mongodb.com/api/data-api-resources/#find-multiple-documents) and return a list of those documents.

```ts
(
	{ filter: MongoFilter, projection: MongoProjection, sort: MongoSort, limit: Integer, skip: Integer },
	overrides?: { collection?: string }
) =>
	Promise<{ documents: Array<Object> }>
```

```js
await db.find({
	filter: { status: 'complete' },
	sort: { completedAt: -1 }
})
```

### findOne

[Find and return the first document matching the filter](https://docs.atlas.mongodb.com/api/data-api-resources/#find-a-single-document).

```ts
(
	{ filter: MongoFilter, projection: MongoProjection },
	overrides?: { collection?: string }
) =>
	Promise<{ document: Object }>
```

```js
await db.findOne({ filter: { _id: { $oid: '6193ebd53821e5ec5b4f6c3b' } } })
```

### insertOne

[Insert a single document](https://docs.atlas.mongodb.com/api/data-api-resources/#insert-a-single-document) and return the ID of that document.

```ts
(
	{ document: EjsonDocument },
	overrides?: { collection?: string }
) =>
	Promise<{ insertedId: String }>
```

```js
await db.insertOne({ type: 'car' })
// => '61935189ec53247016a623c9'
```

### insertMany

[Insert multiple documents at once](https://docs.atlas.mongodb.com/api/data-api-resources/#insert-multiple-documents) and return the generated IDs.

```ts
(documents: Array<EjsonDocument>, overrides?: { collection?: string }) =>
	Promise<{ insertedIds: Array<String> }>
```

```js
await db.insertMany([
	{ type: 'car' },
	{ type: 'truck' }
])
// => [ '61935189ec53247016a623c9', '61935189ec53247016a623ca' ]
```

### replaceOne

[Replace or upsert the first document matching the filter](https://docs.atlas.mongodb.com/api/data-api-resources/#replace-a-single-document) and return the matched and modified count, along with the generated ID if a new document was generated.

```ts
(
	{ filter: MongoFilter, replacement: EjsonDocument, upsert: Boolean },
	overrides?: { collection?: string }
) =>
	Promise<{ matchedCount: Integer, modifiedCount: Integer, upsertedId?: String }>
 ```

```js
await db.replaceOne({
	filter: { id: { $oid: '61935189ec53247016a623c9' } },
	replacement: { type: 'van' }
})
```

### updateOne

[Update the first document matching the filter](https://docs.atlas.mongodb.com/api/data-api-resources/#update-a-single-document) and return the matched and modified count, along with the generated ID if a new document was generated.

```ts
(
	{ filter: MongoFilter, update: MongoUpdate, upsert: Boolean },
	overrides?: { collection?: string }
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
```

### updateMany

[Update all documents matching the filter](https://docs.atlas.mongodb.com/api/data-api-resources/#update-multiple-documents) and return the matched and modified count, along with the generated ID if a new document was generated.

```ts
(
	{ filter: MongoFilter, update: MongoUpdate, upsert: Boolean },
	overrides?: { collection?: string }
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
```

## License

Published and released under the [Very Open License](http://veryopenlicense.com).

If you need a commercial license, [contact me here](https://davistobias.com/license?software=mongodb).
