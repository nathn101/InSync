const buildUserItemMatrix = require('./userItemMatrix');

const calculateSimilarity = (user1, user2) => {
  console.log("user1: ", user1);
  const commonItems = Object.keys(user1).filter(item => user2.hasOwnProperty(item));
  console.log("common items: ", commonItems);
  if (commonItems.length === 0) return 0;

  const user1Ratings = commonItems.map(item => user1[item]);
  const user2Ratings = commonItems.map(item => user2[item]);

  const dotProduct = user1Ratings.reduce((sum, rating, index) => sum + rating * user2Ratings[index], 0);
  const user1Magnitude = Math.sqrt(user1Ratings.reduce((sum, rating) => sum + rating * rating, 0));
  const user2Magnitude = Math.sqrt(user2Ratings.reduce((sum, rating) => sum + rating * rating, 0));

  return dotProduct / (user1Magnitude * user2Magnitude);
};

const getRecommendations = async (userId) => {
  const userItemMatrix = await buildUserItemMatrix();
  console.log("userItemMatrix: ", userItemMatrix);
  console.log("userId: ", userId);
  const targetUser = userItemMatrix[userId];
  console.log("targetUser: ", targetUser);
  if (!targetUser) return [];

  const similarities = {};
  for (const otherUserId in userItemMatrix) {
    console.log(otherUserId);
    if (otherUserId !== userId) {
      const similarity = calculateSimilarity(targetUser, userItemMatrix[otherUserId]);
      similarities[otherUserId] = similarity;
    }
  }

  const recommendations = {};
  for (const otherUserId in similarities) {
    const similarity = similarities[otherUserId];
    const otherUser = userItemMatrix[otherUserId];

    for (const item in otherUser) {
      if (!targetUser.hasOwnProperty(item)) {
        if (!recommendations[item]) {
          recommendations[item] = 0;
        }
        recommendations[item] += similarity * otherUser[item];
      }
    }
  }

  const sortedRecommendations = Object.keys(recommendations)
    .sort((a, b) => recommendations[b] - recommendations[a])
    .slice(0, 10);

  return sortedRecommendations;
};

module.exports = getRecommendations;
