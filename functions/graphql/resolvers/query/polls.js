const { ApolloError } = require('apollo-server-lambda');
const dbPolls = require('../../../../data/polls');
const pollBuilder = require('./pollBuilder');

module.exports = async (_, args, { userId }) => {
  const idToQuery = args.userId || userId;
  let result;
  try {
    const polls = await dbPolls.getAll(idToQuery, idToQuery !== userId);
    const votes = await dbPolls.getVotes(idToQuery, (polls || []).map((poll) => poll.pollId));
    result = (polls || []).map((poll) => {
      const userVote = (votes || []).find((vote) => vote.pollId === poll.pollId);
      return pollBuilder(poll, userId).withUserVote(userVote).build();
    });
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting polls for user ${idToQuery}`);
  }
  return result;
};
