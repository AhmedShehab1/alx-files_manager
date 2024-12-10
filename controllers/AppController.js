const redisClient = require('../utils/redis');
const DBClient = require('../utils/db');

class AppController {

    static getStatus(req, res) {

        if (!req.headers['X-Token']) res.status(200).send(
            {"redis": redisClient.isAlive(), "db": DBClient.isAlive()}
        );

    }

    static getStats(req, res) {

        if (!req.headers['X-Token']) res.status(200).send(
            {"users": DBClient.nbUsers(), "files": DBClient.nbFiles()}
        );

    }

}

module.exports = AppController;
