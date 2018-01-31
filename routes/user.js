var express = require('express');
var router  = express.Router();

//var session = express('express-session');

//load local/custom modules
var userController = require('../controllers/user');

//Mount all routes on router express instance

//create  new user using validation
router.post('/signup',userController.create);
// Delete user with userId
router.post('/login', userController.login);

// Retrieve all users
router.get('/', userController.findAll);

// Retrieve single user with userControllerId
router.get('/:userId', userController.findById);

// Update user with userId
router.put('/:userId', userController.update);

// Delete user with userId
router.delete('/:userId', userController.delete);


//router.get('/', userController.homepage);

//expose router to other files
module.exports =router;
