import { post } from 'httpie'
import { mongodb } from './src/index.js'

const CLUSTER_NAME = 'Cluster0'
const DB_NAME = 'TestDatabase'
const COLL_NAME = 'TestCollection'

const db = mongodb({
	apiKey: process.env.MONGODB_API_KEY,
	apiId: 'data-iiuud',
	cluster: CLUSTER_NAME,
	database: DB_NAME,
	collection: COLL_NAME,
	fetch: post,
})

db.findOne({ filter: 'Jacob Smith' }).then(({ document }) => {
	console.log(document)
})
