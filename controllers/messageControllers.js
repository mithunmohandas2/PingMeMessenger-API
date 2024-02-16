const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const { pusher } = require("../config/pusherService");

// ----------------------Send Message --------------

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).json({ message: "Invalid request received" });
    }

    try {
        const newMessage = new Message({
            sender: req.user._id,
            content,
            chat: chatId
        })
        const savedMessage = await newMessage.save(); //new Message created
        const messageSenderData = await User.populate(savedMessage, { path: "sender", select: "name image" });
        const messageChatData = await Chat.populate(messageSenderData, { path: "chat" })
        const messageFullData = await User.populate(messageChatData, { path: "chat.users", select: "name image email" });

        //push notification
        pusher.trigger(`${chatId}`, "new-message", {
            data: messageFullData
        });

        //update latest message
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: savedMessage._id
        })
        res.status(200).json({
            message: "message sent",
            data: messageFullData
        })

    } catch (error) {
        res.status(400).json({ message: error.message });
        throw new Error(error.message);
    }

})


// ------------------- Get Message --------------

const getMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params
    if (!chatId) {
        return res.status(400).json({ message: "Invalid request received" });
    }
    try {
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name email image")
            .populate("chat")

        res.status(200).json({
            message: "message list",
            dataSize: messages.length,
            data: messages
        })

    } catch (error) {
        res.status(400).json({ message: error.message });
        throw new Error(error.message);
    }
})

module.exports = {
    sendMessage,
    getMessages,
}