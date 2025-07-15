// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: {type: String},
  age: Number,
  gender: String
});

module.exports = mongoose.model('User', userSchema); // Make sure you export mongoose.model here
