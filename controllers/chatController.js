const Chat = require('../models/chatModel');
const asyncHandler = require('express-async-handler');

// .................Access Chat.......................

const accessChat = asyncHandler(async (req, res) => {
    const {userId} = req.body
    if(!userId){
        return res.status(400).json({ message: "userId data missing" })
    }
    const isChat = await Chat.find({ });
    if (isChat) {
        res.status(200).json({
            message: "chat details",
            data: isChat
        })
    }
})

// .................Access Chat.......................

const getChats = asyncHandler(async (req, res) => {
    
  
})


module.exports = {
    accessChat,
    getChats,
}