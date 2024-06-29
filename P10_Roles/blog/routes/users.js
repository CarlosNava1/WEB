var express = require('express');
var router = express.Router();

const userController = require('../controllers/user');
const sessionController = require('../controllers/session');

// Autoload
router.param('userId', userController.load);


// Routes for the resource /users
router.get('/',    sessionController.adminRequired,                 userController.index);
router.get('/:userId(\\d+)', sessionController.loginRequired,   sessionController.adminOrMyselfRequired,    userController.show);
router.get('/new',sessionController.loginRequired, sessionController.adminRequired,              userController.new);
router.post('/',  sessionController.loginRequired,     sessionController.adminRequired,            userController.create);
router.get('/users/:userId(\\d+)/edit',   sessionController.adminOrMyselfRequired, userController.edit);
router.put('/:userId(\\d+)',  sessionController.loginRequired,sessionController.adminOrMyselfRequired,    userController.update);
router.delete('/:userId(\\d+)', sessionController.loginRequired, sessionController.adminOrMyselfRequired,  userController.destroy);

module.exports = router;