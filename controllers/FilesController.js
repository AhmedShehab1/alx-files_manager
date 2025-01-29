import { generateUUID } from '../utils/utils';
const fs = require('fs');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');


class FilesController {
  static async postUpload(req, res) {
    if (!req.headers['X-Token']) res.status(401).send('Unauthorized');

    const key = `auth_${req.headers['X-Token']}`;

    // Retreive user using his id cached in redis where the key is the token
    const userId = await redisClient.get(key);
    if (!userId) res.status(401).send('Unauthorized');

    const {
      name, type, parentId, isPublic, data,
    } = req.body;

    if (type === 'folder') {
      const newFolderId = await dbClient.insertDocument('files', {
        userId,
        name,
        type,
        isPublic,
        parentId,
      });

      const newFolder = {
        id: newFolderId,
        userId,
        name,
        type,
        isPublic,
        parentId,
      };

      return res.status(201).json(newFolder);
    }

    const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

    fs.mkdir(FOLDER_PATH, { recursive: true }, (err) => {
      if (err) throw err;
    });

    const fileUUID = generateUUID();
    fs.writeFile(`${FOLDER_PATH}/${fileUUID}`, data, { encoding: 'base64' }, (err) => {
      if (err) throw err;
    });

    return res.status(201).json({
      userId,
      name,
      type,
      isPublic,
      parentId,
      localPath: `${FOLDER_PATH}/${fileUUID}`,
    });
  }
}

module.exports = FilesController;
