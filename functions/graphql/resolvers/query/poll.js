const { ApolloError } = require('apollo-server-lambda');
const get = require('../../../../data/polls/get');
const pollBuilder = require('./pollBuilder');

module.exports = async (_, { userId, createTimestamp }, context) => {
  let result;
  try {
    const poll = await get.poll(userId || context.userId, createTimestamp);
    console.log('got the data back', poll);
    if (poll) {
      const userVote = await get.vote(context.userId, poll.pollId);
      result = pollBuilder(poll, context.userId).withUserVote(userVote).build();
    }
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting poll ${userId}:${createTimestamp}`);
  }
  return result;
};
