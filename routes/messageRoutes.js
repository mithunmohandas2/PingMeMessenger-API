const express = require('express');
const messageRouter = express.Router();
const { protect } = require("../middlewares/auth");
const { sendMessage, getMessages } = require('../controllers/messageControllers');

messageRouter.post('/', protect, sendMessage);
messageRouter.get('/:chatId', protect, getMessages);


module.exports = messageRouter;
