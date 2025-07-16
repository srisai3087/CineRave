const mongoose = require('mongoose');

const UserScheema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: 'User',
  },
});

const User = mongoose.model('user', UserScheema);

module.exports = User;