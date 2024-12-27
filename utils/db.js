const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

class DBClient {
  constructor () {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || '27017';
    this.database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${this.host}:${this.port}`;

    this.client = new MongoClient(uri, { useUnifiedTopology: true });

    this.db = null;
  }

  async connect () {
    if (!this.db) {
      try {
        await this.client.connect();
        this.db = this.client.db(this.database);
      } catch (err) {
        console.error('Error connection to MongoDB:', err);
        throw err;
      }
    }
  }

  isAlive () {
    return this.client.isConnected();
  }

  async nbUsers () {
    if (!this.db) await this.connect();
    return await this.db.collection('users').countDocuments();
  }

  async nbFiles () {
    if (!this.db) await this.connect();
    return await this.db.collection('files').countDocuments();
  }

  async insertDocument (collectionName, document) {
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.insertOne(document);
      console.log('Inserted document with ID:', result.insertedId);
      return result.insertedId;
    } catch (err) {
      console.error('Error inserting document:', err);
    }
  }

  async getDocument (collectionName, query) {
    if (!this.db) await this.connect();
    try {
      const collection = this.db.collection(collectionName);

      if (query._id) {
        query._id = new ObjectId(query._id);
      }
      
      const doc = await collection.findOne(query);

      console.log('Found document: ', doc);
      return doc;
    } catch (err) {
      console.error('Error finding document:', err);
    }
  }
}

const dbClient = new DBClient();

(async () => {
  await dbClient.connect();
})();

module.exports = dbClient;
