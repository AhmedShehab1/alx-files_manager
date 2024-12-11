const redis = require('redis');

const REDIS_PASSWORD = process.env.REDIS_PASSWORD
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = process.env.REDIS_PORT

class RedisClient {
  constructor () {
    this.client = redis.createClient({
      url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
    });
    this.connected = true;

    this.client.on('ready', () => {
      this.connected = true;
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('end', () => {
      console.log('Redis Client disconnected');
      this.connected = false;
    });
  }

  isAlive () {
    return this.connected;
  }

  async waitForReady () {
    if (this.connected) {
      return;
    }
    return new Promise((resolve) => {
      this.client.once('ready', resolve);
    });
  }

  async get (key) {
    await this.waitForReady();
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async set (key, value, duration) {
    await this.waitForReady();
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async del (key) {
    await this.waitForReady();
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
