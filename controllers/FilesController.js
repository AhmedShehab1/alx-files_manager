const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const validateFileUpload = async (req, res, next) => {
  const { name, type, parentId = 0, isPublic = false, data } = req.body;

  if (!name) res.status(400).send('Missing name');

  if (!type) res.status(400).send('Missing type');

  if ((type === 'file' || type === 'image') && !data) res.status(400).send('Missing data');

  if (parentId) {
    const parent = await dbClient.getDocument('files', { _id: parentId });

    if (!parent) res.status(400).send('Parent not found');
    if (parent.type !== 'folder') res.status(400).send('Parent is not a folder');
  }

  req.body.parentId = parentId;
  req.body.isPublic = isPublic;

  next();
};

class FilesController {
  static async postUpload (req, res) {
    if (!req.headers['X-Token']) res.status(401).send('Unauthorized');

    // Retreive user using his id cached in redis where the key is the token
    const userId = await redisClient.get(req.headers['X-Token']);
    if (!userId) res.status(401).send('Unauthorized');

    const user = await dbClient.getDocument({ _id: userId });
    if (!user) res.status(404).send('User Not Found');

    const { name, type, parentId, isPublic, data } = req.body;
  }
}

module.exports = FilesController;

exports.validateFileUpload = validateFileUpload;
