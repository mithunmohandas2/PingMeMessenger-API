const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const imageContoller = require('../controllers/imageController');
const {protect} = require("../middlewares/auth")


//Routes
userRouter.get('/test', userController.test)
userRouter.post('/register', userController.registerUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/all', protect, userController.listUsers)
userRouter.post('/uploadPhoto', protect, imageContoller.upload.single('profilePic'), userController.uploadPhoto);

module.exports = userRouter;
