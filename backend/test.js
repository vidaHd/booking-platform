require('dotenv').config();
const { MongoClient } = require('mongodb');

(async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db(process.env.DB_NAME);
    console.log('Connected to DB:', db.databaseName);
    client.close();
  } catch (err) {
    console.error(err);
  }
})();
