const express = require('express');
const FilesController = require('../controllers/FilesController');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const { validateFileUpload } = require('../validators/file.validator');
const { tokenValidation } = require('../validators/auth.validator');

const router = express.Router();

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.post('/users', UsersController.postNew);
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/files', tokenValidation, validateFileUpload, FilesController.postUpload);
module.exports = router;
