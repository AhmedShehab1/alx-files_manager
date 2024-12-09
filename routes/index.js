const express = require('express');
const FilesController = require('../controllers/FilesController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

router.post('/files', FilesController.postUpload);
module.exports = router;
