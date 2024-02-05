const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('express-async-errors');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const userRoutes = require('./Routes/user-route');
const chatRoutes = require('./Routes/chat-route');
const messageRoutes = require('./Routes/message-route');

app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

app.use((err, req, res, next) => {
  res.status(err?.status || 500).json({ err: 'Something went wrong' });
});

const uri = process.env.MONGO_URI_LOCAL;
mongoose
  .connect(uri)
  .then((res) => console.log(res.connection.host))
  .catch((err) => console.log('Connection failed', err.message));

const port = process.env.PORT || 8000;
app.listen(port, (req, res) => {
  console.log(`Server running on port : ${port}`);
});
