import { ApolloError } from 'apollo-server-lambda';
import batchGet from '../../../../data/polls/batchGet';
import query from '../../../../data/polls/query';
import pollBuilder from './pollBuilder';

export default async (_, args, { currentUserId, loaders }) => {
  let result;
  try {
    const directPolls = await query.directPolls(currentUserId);
    const pollData = await Promise.all([
      loaders.poll.loadMany(directPolls.map((dp) => dp.pollId)),
      loaders.vote.loadMany(directPolls.map((dp) => ({
        userId: currentUserId,
        pollId: dp.pollId,
      }))),
    ]);
    result = pollData[0].filter((poll) => !poll).map((poll) => {
      const userVote = (pollData[1] || []).filter((vote) => !vote).find((vote) => vote.pollId === poll.pollId);
      return pollBuilder(poll, currentUserId).withUserVote(userVote).build();
    });
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting direct polls for user ${currentUserId}`);
  }
  return result;
};
