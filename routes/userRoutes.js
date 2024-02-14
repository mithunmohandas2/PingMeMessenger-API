const express = require('express');
const user_router = express.Router();
const userController = require('../controllers/userController');
const imageContoller = require('../controllers/imageController');
const auth = require("../middlewares/auth")


//Routes
user_router.post('/register', userController.registerUser);
user_router.post('/login', userController.loginUser);
user_router.get('/test', userController.test)
user_router.post('/uploadPhoto', auth.verifyToken, imageContoller.upload.single('profilePic'), userController.uploadPhoto);

module.exports = user_router;
