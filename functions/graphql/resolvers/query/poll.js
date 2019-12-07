const { ApolloError } = require('apollo-server-lambda');
const dbPolls = require('../../../../data/polls');
const pollBuilder = require('./pollBuilder');

module.exports = async (_, { userId, createTimestamp }, context) => {
  let result;
  try {
    const poll = await dbPolls.get(userId || context.userId, createTimestamp);
    const userVote = await dbPolls.getUserVote(context.userId, poll.pollId);
    result = pollBuilder(poll, context.userId).withUserVote(userVote).build();
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting poll ${userId}:${createTimestamp}`);
  }
  return result;
};
