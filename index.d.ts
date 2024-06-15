export function mongodb(params: {
	apiKey?: string;
	apiId?: string;
	apiRegion?: string;
	apiUrl?: string;
	dataSource?: string;
	database?: string;
	collection?: string;
	fetch?: (
		url: string,
		options: {
			method: 'POST',
			headers: { [key: string]: string },
			body: string
		},
	) => Promise<{
		status: number,
		headers: { [key: string]: string },
		json: () => Promise<unknown>,
		text: () => Promise<string>,
	}>;
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
