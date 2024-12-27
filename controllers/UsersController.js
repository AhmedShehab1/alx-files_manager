const sha1 = require('sha1');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

function hashPasswordWithSha1(password) {
  return sha1(password);
}

class UsersController {
  static async getMe(req, res) {
    const token = req.get('X-Token');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const key = `auth_${token}`;

    const userId = await redisClient.get(key);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await dbClient.getDocument('users', { _id: userId });

    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    return res.status(200).json({ id: user._id, email: user.email });
  }

  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    if (!password) return res.status(400).json({ error: 'Missing password' });

    const user = await dbClient.getDocument('users', { email });

    if (user) return res.status(400).json({ error: 'Already exist' });

    const hashedPassword = hashPasswordWithSha1(password);

    const newUser = {
      email,
      password: hashedPassword,
    };

    const id = await dbClient.insertDocument('users', newUser);

    return res.status(201).json({ id, email });
  }
}

module.exports = UsersController;
