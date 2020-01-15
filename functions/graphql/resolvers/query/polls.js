import { ApolloError } from 'apollo-server-lambda';
import query from '../../../../data/polls/query';
import batchGet from '../../../../data/polls/batchGet';
import pollBuilder from './pollBuilder';

export default async (_, args, { currentUserId, loaders }) => {
  const idToQuery = args.userId || currentUserId;
  let result;
  try {
    const getPolls = idToQuery !== currentUserId ? query.publicPolls : query.polls;
    const polls = await getPolls(idToQuery);
    if (polls.length) {
      const votes = await loaders.vote.loadMany((polls || []).map((poll) => ({
        userId: currentUserId,
        pollId: poll.pollId,
      })));
      result = (polls || []).map((poll) => {
        const userVote = (votes || []).find((vote) => vote.pollId === poll.pollId);
        return pollBuilder(poll, currentUserId).withUserVote(userVote).build();
      });
    }
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting polls for user ${idToQuery}`);
  }
  return result;
};
