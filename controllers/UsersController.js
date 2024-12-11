const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha1').update(password).digest('hex');
}

class UsersController {

    static postNew(req, res) {

        const { email, password } = req.body;
        if (!email) res.status(400).send('Missing email');

        if (!password) res.status(400).send('Missing password');

        const user = dbClient.getDocument("users", { email: email });

        if (user) res.status(400).send('Already exist');

        const hashed_password = hashPassword(password);

        const newUser = {
            email: email,
            password: hashed_password
        };

        const _id = dbClient.insertDocument("users", newUser);

        return res.status(201).json({ "_id": _id, "email": email });
    }

}

module.exports = UsersController;
