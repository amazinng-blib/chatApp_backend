const express = require('express');
const {
  registerUser,
  loginUser,
  findUser,
  getAllUsers,
} = require('../Controllers/user-controller');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/findUser/:userId', findUser);
router.get('/users', getAllUsers);

module.exports = router;
