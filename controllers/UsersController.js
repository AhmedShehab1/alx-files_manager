const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

function hashPassword(password) {
    return crypto.createHash('sha1').update(password).digest('hex');
}

function checkPassword(password, hash) {
    const hashed_password = hashPassword(password);

    return hashed_password === hash;
}

function generateToken() {
    return uuidv4();
}

class UsersController {

    static async getConnect(req, res) {
        const authorization = req.headers.authorization;

        const base64Credentials = authorization.split(' ')[1];

        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');

        const [email, password] = credentials.split(':');

        const user = dbClient.getDocument("users", { email: email });

        if (!user) res.status(401).send('Unauthorized');

        const token = generateToken();

        const key = `auth_${token}`;

        await redisClient.set(key, user._id.toString(), 86400);

        return res.status(200).json({ token: token });

    }

    static async getDisconnect(req, res) {

        const token = req.headers['X-Token'];

        if (!token) res.status(401).send('Unauthorized');

        const key = `auth_${token}`;

        const userId = await redisClient.get(key);

        if (!userId) res.status(401).send('Unauthorized');

        redisClient.del(key);

        return res.status(204).send

    }

    static getMe(req, res) {

        const token = req.headers['X-Token'];

        if (!token) res.status(401).send('Unauthorized');

        const key = `auth_${token}`;

        const userId = redisClient.get(key);

        if (!userId) res.status(401).send('Unauthorized');

        const user = dbClient.getDocument("users", { _id: userId });

        if (!user) res.status(401).send('Unauthorized');

        return res.status(200).json({ "_id": user._id, "email": user.email });

    }

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
