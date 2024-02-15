const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const DBconnect = require('./bin/config')
const dotenv = require('dotenv').config()

const chatRouter = require('./routes/chatRoutes');
const userRouter = require('./routes/userRoutes');
const messageRouter = require('./routes/messageRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

const app = express();

//CORS Policy
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //allow all origin (temporary)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Handle the MongoDB connection promise
DBconnect.then(() => {
  console.log('MongoDB connection is established.');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//test Route
app.get('/', (req, res) => res.status(200).json({ message: 'API running successfully' }));
app.get('/api', (req, res) => res.status(200).json({ message: 'API initialized successfully' }));

app.use("/api/user", userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

app.use(notFound)
app.use(errorHandler)

module.exports = app;
