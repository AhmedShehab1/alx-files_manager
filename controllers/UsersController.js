const redisClient = require('../utils/redis');
const DBClient = require('../utils/db');

class UsersController {

    static postNew(req, res) {

        const { email, password } = req.body;
        if (!email) res.status(400).send('Missing email');

        if (!password) res.status(400).send('Missing password');


    }

}

module.exports = UsersController;
