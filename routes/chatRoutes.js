const express = require('express');
const chatRouter = express.Router();
const { protect } = require("../middlewares/auth");
const { accessChat, getChats, createGroupChat, renameGroupChat } = require('../controllers/chatController');

chatRouter.post('/', protect, accessChat);
chatRouter.get('/', protect, getChats);
chatRouter.post('/group', protect, createGroupChat);
chatRouter.put('/groupRename', protect, renameGroupChat);
// chatRouter.put('/addGroup', protect, addToGroup);
// chatRouter.put('/exitGroup', protect, exitGroup);

module.exports = chatRouter;
