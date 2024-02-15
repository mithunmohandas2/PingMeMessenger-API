const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// .................Access Chat.......................

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        return res.status(400).json({ message: "userId data missing" })
    }

    const sender = req.user._id
    const receiver = userId

    //check for existing chat
    let isChat = await Chat.find({
        isGroup: false,
        $and: [
            { users: { $in: [sender] } },
            { users: { $in: [receiver] } },
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email image",
    })

    if (isChat?.length > 0) {
        res.status(200).json({
            message: "chat details",
            data: isChat[0]
        })
    } else {
        //Case: No chat data present 
        try {
            const chat = new Chat({
                chatName: "sender",
                isGroup: false,
                users: [sender, receiver]
            });
            const newChat = await chat.save();  //new chat created

            const fullChat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password")

            res.status(200).json({
                message: "new chat details",
                data: fullChat
            })
        } catch (error) {
            res.status(400).json({ message: error?.message });
            throw new Error(error?.message)
        }
    }
})

// .................Access Chat.......................

const getChats = asyncHandler(async (req, res) => {
    try {
        const fullChat = await Chat.find({ users: { $in: [req.user._id] } }).populate("users", "-password")
        res.status(200).json({
            message: "chat list",
            dataSize: fullChat?.length,
            data: fullChat
        })
    } catch (error) {
        res.status(400).json({ message: error?.message });
        throw new Error(error?.message)
    }
})


module.exports = {
    accessChat,
    getChats,
}