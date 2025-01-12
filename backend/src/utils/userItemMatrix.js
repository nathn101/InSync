const UserTrack = require('../config/UserTrack');
const User = require('../config/User');

const buildUserItemMatrix = async () => {
  const users = await User.find();
  const userItemMatrix = {};

  for (const user of users) {
    const userTracks = await UserTrack.find({ userId: user._id }); // Use ObjectId
    userItemMatrix[user._id] = {};

    for (const userTrack of userTracks) {
      userItemMatrix[user._id][userTrack.trackId] = userTrack.playCount;
    }
  }

  return userItemMatrix;
};

module.exports = buildUserItemMatrix;