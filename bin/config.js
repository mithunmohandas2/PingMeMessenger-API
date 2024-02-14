const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

mongoose.Promise = global.Promise;

// Connect MongoDB at default port from env.
module.exports = mongoose.connect(process.env.MONGO_URI);
