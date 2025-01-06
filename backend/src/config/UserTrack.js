const mongoose = require('mongoose');

const UserTrackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  trackId: { type: String, required: true },
  trackName: { type: String }, // Add trackName field
  playCount: { type: Number, default: 1 },
  saved: { type: Boolean, default: false }
});

const UserTrack = mongoose.model('UserTrack', UserTrackSchema);

module.exports = UserTrack;