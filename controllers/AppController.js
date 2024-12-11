const redisClient = require('../utils/redis');
const DBClient = require('../utils/db');

class AppController {
  static getStatus (req, res) {
    return res.status(200).json(
      { redis: redisClient.isAlive(), db: DBClient.isAlive() }
    );
  }

  static getStats (req, res) {
    return res.status(200).json(
      { users: DBClient.nbUsers(), files: DBClient.nbFiles() }
    );
  }
}

module.exports = AppController;
