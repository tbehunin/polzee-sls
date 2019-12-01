const { ApolloError } = require('apollo-server-lambda');
const dbPolls = require('../../../../data/polls');

module.exports = async (_, { userId, createTimestamp }, context) => {
  let result;
  try {
    result = await dbPolls.get(userId || context.userId, createTimestamp);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting poll ${userId}:${createTimestamp}`);
  }
  return result;
};
