const redis = require('redis');
require('dotenv').config();

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

class RedisClient {
  constructor() {
    this.client = redis.createClient(
      {
        host: REDIS_HOST,
        port: 6379,
      },
    );

    this.connected = false;

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

  isAlive() {
    return this.connected;
  }

  async waitForReady() {
    if (this.connected) {
      return undefined;
    }
    return new Promise((resolve) => {
      this.client.once('ready', resolve);
    });
  }

  async get(key) {
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

  async set(key, value, duration) {
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

  async del(key) {
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
