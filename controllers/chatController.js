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
    const isChat = await Chat.find({
        isGroup: false,
        $and: [
            { users: { $in: [sender] } },
            { users: { $in: [receiver] } },
        ]
    }).populate("users", "-password").populate("latestMessage")

    //populate user details for latest message
    const existingChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email image",
    })

    if (existingChat?.length > 0) {
        res.status(200).json({
            message: "chat details",
            data: existingChat[0]
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
        //get all chats for a user
        const chatlist = await Chat.find({ users: { $in: [req.user._id] } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })

        //populate user details for latest message
        const fullChat = await User.populate(chatlist, {
            path: "latestMessage.sender",
            select: "name email image",
        })

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


// .................Create Group Chat.......................

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Please fill all fields" })
    }

    // extract stringified users list
    const users = JSON.parse(req.body.users)
    if (users?.length < 2) {
        //No adequate members for group
        return res.status(400).json({ message: "More than 2 users required for group chat" })
    }
    users.push(req.user)  //adding current user

    try {
        const groupChat = new Chat({
            chatName: req.body.name,
            isGroup: true,
            users,
            groupAdmin: req.user._id
        });
        const newGroupChat = await groupChat.save();  //new group chat created

        const fullGroupChat = await Chat.findOne({ _id: newGroupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json({
            message: "new group chat details",
            data: fullGroupChat
        })

    } catch (error) {
        res.status(400).json({ message: error?.message });
        throw new Error(error?.message)
    }
})


// .................Rename Group Chat.......................

const renameGroupChat = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    if (!chatId || !chatName) {
        return res.status(400).json({ message: "Please fill all fields" })
    }

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404).json({ message: "Chat not found" })
        throw new Error("Chat not found");
    } else {
        res.status(200).json({ message: "Chat name updated", data: updatedChat });
    }
});

module.exports = {
    accessChat,
    getChats,
    createGroupChat,
    renameGroupChat,
}