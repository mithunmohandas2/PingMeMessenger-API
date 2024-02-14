const express = require('express');
const chatRouter = express.Router();
const { protect } = require("../middlewares/auth");
const { accessChat, getChats } = require('../controllers/chatController');

chatRouter.post('/', protect, accessChat);
chatRouter.get('/', protect, getChats);
// chatRouter.post('/group', protect, createGroupChat);
// chatRouter.put('/exitGroup', protect, exitGroup);
// chatRouter.put('/addGroup', protect, addToGroup);


module.exports = chatRouter;
