require('dotenv').config();

// const { MongoClient } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_USER = process.env.MONGODB_USER;

class DBClient {

  constructor () {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || '27017';
    this.database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@free-mongodb.jj4vz.mongodb.net/?retryWrites=true&w=majority&appName=Free-MongoDB`;
    // const uri = `mongodb://${this.host}:${this.port}`;

    // this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.client = new MongoClient(uri);
    
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
  async insertDocument(collectionName, document) {
    try {

      const collection = db.collection(collectionName);
      const result = await collection.insertOne(document);
      console.log('Inserted document with ID:', result.insertedId);
      return result.insertedId;
      
    } catch (err) {

      console.error('Error inserting document:', err);
    
    }
  }
  async getDocument(collectionName, query) {
    if (!this.db) await this.connect();
    try {

      const collection = db.collection(collectionName);
      const doc = await collection.findOne(query);
      
      console.log('Found document: ', doc);
      return user;

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
