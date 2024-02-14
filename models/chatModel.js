const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true,
    },
    isGroup: {
        type: Boolean,
        default: false,
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    latestMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Chat', chatSchema);