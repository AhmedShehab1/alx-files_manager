const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { generateToken, hashPasswordWithSha1 } = require('../utils/utils');

class AuthController {
  static async getConnect(req, res) {
    const { authorization } = req.headers;

    const base64Credentials = authorization.split(' ')[1];

    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');

    const [email, pass] = credentials.split(':');
    const password = hashPasswordWithSha1(pass);

    const user = await dbClient.getDocument('users', { email, password });

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const token = generateToken();

    const key = `auth_${token}`;

    await redisClient.set(key, user._id.toString(), 86400);

    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.get('X-Token');

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const key = `auth_${token}`;

    const userId = await redisClient.get(key);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await redisClient.del(key);

    return res.status(204).send();
  }
}

module.exports = AuthController;
