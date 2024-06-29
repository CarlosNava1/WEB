var express = require('express');
var router = express.Router();

const sessionController = require('../controllers/session');

// autologout
router.all('*',sessionController.deleteExpiredUserSession);

// Routes for the resource /session
router.get('/login',    sessionController.new);     // login form
router.post('/login',   sessionController.create);  // create sesion
router.delete('/login', sessionController.destroy); // close sesion


module.exports = router;