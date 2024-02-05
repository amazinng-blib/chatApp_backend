const express = require('express');
const {
  createChat,
  findUserChat,
  findChat,
} = require('../Controllers/chat-controller');
const { route } = require('./user-route');
const router = express.Router();

router.post('/create-chat', createChat);
router.get('/find-user-chat/:userId', findUserChat);
router.get('/find-chat/:firstId/:secondId', findChat);

module.exports = router;
