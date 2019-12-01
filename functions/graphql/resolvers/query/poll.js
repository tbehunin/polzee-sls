const dbPolls = require('../../../../data/polls');

module.exports = async (_, { userId, createTimestamp }, context) => dbPolls.get(userId || context.userId, createTimestamp);
