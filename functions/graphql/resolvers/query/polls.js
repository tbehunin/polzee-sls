const { ApolloError } = require('apollo-server-lambda');
const query = require('../../../../data/polls/query');
const batchGet = require('../../../../data/polls/batchGet');
const pollBuilder = require('./pollBuilder');

module.exports = async (_, args, { userId }) => {
  const idToQuery = args.userId || userId;
  let result;
  try {
    const getPolls = idToQuery !== userId ? query.publicPolls : query.polls;
    const polls = await getPolls(idToQuery);
    if (polls.length) {
      const votes = await batchGet.votes(idToQuery, (polls || []).map((poll) => poll.pollId));
      result = (polls || []).map((poll) => {
        const userVote = (votes || []).find((vote) => vote.pollId === poll.pollId);
        return pollBuilder(poll, userId).withUserVote(userVote).build();
      });
    }
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting polls for user ${idToQuery}`);
  }
  return result;
};
