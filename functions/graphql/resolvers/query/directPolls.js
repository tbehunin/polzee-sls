import { ApolloError } from 'apollo-server-lambda';
import batchGet from '../../../../data/polls/batchGet';
import query from '../../../../data/polls/query';
import pollBuilder from './pollBuilder';

export default async (_, args, { currentUserId }) => {
  let result;
  try {
    const directPolls = await query.directPolls(currentUserId);
    const pollData = await Promise.all([
      batchGet.polls(directPolls.map((dp) => dp.pollId)),
      batchGet.votes(currentUserId, (directPolls).map((dp) => dp.pollId)),
    ]);
    result = pollData[0].map((poll) => {
      const userVote = (pollData[1] || []).find((vote) => vote.pollId === poll.pollId);
      return pollBuilder(poll, currentUserId).withUserVote(userVote).build();
    });
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting direct polls for user ${currentUserId}`);
  }
  return result;
};
