const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');

function hashPasswordWithSha1 (password) {
  return sha1(password);
}

// function checkPassword (password, hash) {
//   const hashedPassword = hashPasswordWithSha1(password);

//   return hashedPassword === hash;
// }

function generateToken () {
  return uuidv4();
}

class UsersController {
  static async getConnect (req, res) {
    const authorization = req.headers.authorization;

    const base64Credentials = authorization.split(' ')[1];

    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');

    const email = credentials.split(':')[0];

    const user = await dbClient.getDocument('users', { email });

    if (!user) res.status(401).send('Unauthorized');

    const token = generateToken();

    const key = `auth_${token}`;

    await redisClient.set(key, user._id.toString(), 86400);

    return res.status(200).json({ token });
  }

  static async getDisconnect (req, res) {
    const token = req.headers['X-Token'];

    if (!token) res.status(401).send('Unauthorized');

    const key = `auth_${token}`;

    const userId = await redisClient.get(key);

    if (!userId) res.status(401).send('Unauthorized');

    await redisClient.del(key);

    return res.status(204).send;
  }

  static async getMe (req, res) {
    const token = req.headers['X-Token'];

    if (!token) res.status(401).send('Unauthorized');

    const key = `auth_${token}`;

    const userId = await redisClient.get(key);

    if (!userId) res.status(401).send('Unauthorized');

    const user = await dbClient.getDocument('users', { _id: userId });

    if (!user) res.status(401).send('Unauthorized');

    return res.status(200).json({ _id: user._id, email: user.email });
  }

  static async postNew (req, res) {
    const { email, password } = req.body;
    if (!email) res.status(400).send('Missing email');

    if (!password) res.status(400).send('Missing password');

    const user = await dbClient.getDocument('users', { email });

    if (user) res.status(400).send('Already exist');

    const hashedPassword = hashPasswordWithSha1(password);

    const newUser = {
      email,
      password: hashedPassword
    };

    const id = await dbClient.insertDocument('users', newUser);

    return res.status(201).json({ id, email });
  }
}

module.exports = UsersController;
