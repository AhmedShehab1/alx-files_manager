const redisClient = require('../utils/redis');

class FilesController {

    static postUpload(req, res) {

        if (!req.headers['X-Token']) res.status(401).send('Unauthorized');

    }

}

module.exports = FilesController;
