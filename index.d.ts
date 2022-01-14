export function mongodb(params: {
	apiKey?: string;
	apiId?: string;
	apiRegion?: string;
	apiUrl?: string;
	cluster: string;
	database: string;
	collection?: string;
	fetch?: (url: string, options: object) => Promise<object>;
}): {
	aggregate;
	deleteOne;
	deleteMany;
	find;
	findOne;
	insertOne;
	insertMany;
	replaceOne;
	updateOne;
	updateMany;
};
