const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
