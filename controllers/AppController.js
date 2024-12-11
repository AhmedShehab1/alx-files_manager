const redisClient = require('../utils/redis');
const DBClient = require('../utils/db');

class AppController {

    static getStatus(req, res) {

        return res.status(200).json(
            {"redis": redisClient.isAlive(), "db": DBClient.isAlive()}
        );

    }

    static async getStats(req, res) {

        return res.status(200).json(
            {"users": await DBClient.nbUsers(), "files": await DBClient.nbFiles()}
        );

    }

}

module.exports = AppController;
