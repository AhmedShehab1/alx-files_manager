const express = require('express');
const FilesController = require('../controllers/FilesController');
const UsersController = require('../controllers/UsersController');
const { validateFileUpload } = require('../controllers/FilesController');

const router = express.Router();

router.post('/files', validateFileUpload, FilesController.postUpload);
module.exports = router;
