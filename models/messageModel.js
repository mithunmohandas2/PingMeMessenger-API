const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        trim: true,
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Message', messageSchema);