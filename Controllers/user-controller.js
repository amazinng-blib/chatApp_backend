const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const userModel = require('../Models/userModel');

// TODO: Create token

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET;
  return jwt.sign({ _id }, jwtKey);
};

// TODO: Register

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await userModel.findOne({ email });

    if (userExist) {
      return res
        .status(400)
        .json({ message: 'User with this email already exist. Please login' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Email must be a valid email' });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          'password must contain atleast one uppercase, one lowercase, one special character and a number',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new userModel({ name, email, password: hashed });

    await user.save();

    const token = createToken(user?._id);
    // const { password, ...otherdetails } = user?._doc;
    const userDetails = {
      name,
      email,
      token,
    };

    res.status(201).json({ message: 'Registration Success', userDetails });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = createToken(user?._id);
    if (user) {
      const { password, ...otherDetails } = user?._doc;

      const userDetails = {
        otherDetails,
        token,
      };

      return res
        .status(200)
        .json({ message: 'Logged-in Successfully', userDetails });
    }
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

// TODO: find User

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    if (user) {
      const { password, ...otherDetails } = user?._doc;

      return res.status(200).json({ otherDetails });
    }
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

// TODO: get all users

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).sort({ createdAt: -1 });

    if (users) {
      const userDetails = users?.map((user) => {
        return {
          name: user?.name,
          email: user?.email,
          _id: user?._id,
          createdAt: user?.createdAt,
          updatedAt: user?.updatedAt,
        };
      });
      return res.status(200).json({ userDetails });
    }
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

module.exports = { registerUser, loginUser, findUser, getAllUsers };
