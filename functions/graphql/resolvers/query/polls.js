import { ApolloError } from 'apollo-server-lambda';
import query from '../../../../data/polls/query';
import batchGet from '../../../../data/polls/batchGet';
import pollBuilder from './pollBuilder';

export default async (_, args, { userId }) => {
  const idToQuery = args.userId || userId;
  let result;
  try {
    const getPolls = idToQuery !== userId ? query.publicPolls : query.polls;
    const polls = await getPolls(idToQuery);
    if (polls.length) {
      const votes = await batchGet.votes(userId, (polls || []).map((poll) => poll.pollId));
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
