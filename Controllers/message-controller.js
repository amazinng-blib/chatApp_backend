const chatModel = require('../Models/chatModel');
const messageModel = require('../Models/message-model');

//todo: create message

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const message = new messageModel({ chatId, senderId, text });

    const response = await message.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// todo: get messages

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });

    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMessage,
  getMessages,
};
