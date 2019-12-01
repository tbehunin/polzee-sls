const dbPolls = require('../../../../data/polls');

module.exports = (_, { userId, createTimestamp }, context) => {
  let result;
  try {
    result = dbPolls.get(userId || context.userId, createTimestamp);
  } catch (error) {
    console.error(error);
  }
  return result;
};
