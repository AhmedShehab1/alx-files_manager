const express = require('express');
const FilesController = require('../controllers/FilesController');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const { validateFileUpload } = require('../controllers/FilesController');

const router = express.Router();

router.post('/connect', UsersController.getConnect);
router.post('/disconnect', UsersController.getDisconnect);
router.post('/users/me', UsersController.getMe);
router.post('/users', UsersController.postNew);
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/files', validateFileUpload, FilesController.postUpload);
module.exports = router;
