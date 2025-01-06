const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  spotifyId: String,
  displayName: String,
  email: String,
  images: Array,
  followers: Number,
  accessToken: String,
  refreshToken: String,
  topTracks: Array
});

const User = mongoose.model('User', userSchema);

module.exports = User;