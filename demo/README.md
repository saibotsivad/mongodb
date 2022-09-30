# Demo of `@saibotsivad/mongodb`

This is a demo that is also used to test requests and responses from an actual MongoDB Data API.

It is meant to run in a NodeJS environment, so it makes use of the `fetch` shim.

To run it yourself, you'll need to set some environment variables, e.g. with `bash` you might do:

```bash
export MONGODB_API_URL="https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1"
export MONGODB_API_KEY="YOUR_API_KEY"
export MONGODB_DATABASE_NAME="local" # any name is fine
export MONGODB_CLUSTER_NAME="YOUR_CLUSTER"
node demo.js
```

The demo utilizes all methods exposed by the Data API, and asserts things about them.
