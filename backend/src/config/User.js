const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  displayName: { type: String },
  email: { type: String },
  images: { type: Array },
  followers: { type: Number },
  accessToken: { type: String },
  refreshToken: { type: String },
  topTracks: { type: Array }
});

const User = mongoose.model('User', userSchema);

module.exports = User;