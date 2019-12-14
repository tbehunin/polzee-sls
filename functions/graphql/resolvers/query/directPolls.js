import { ApolloError } from 'apollo-server-lambda';
import batchGet from '../../../../data/polls/batchGet';
import query from '../../../../data/polls/query';
import pollBuilder from './pollBuilder';

export default async (_, args, { userId }) => {
  let result;
  try {
    const directPolls = await query.directPolls(userId);
    const votes = await batchGet.votes(userId, (directPolls).map((dp) => dp.pollId));
    const polls = await batchGet.polls(directPolls.map((dp) => ({
      userId: dp.fromUserId,
      createTimestamp: dp.createTimestamp,
    })));
    result = polls.map((poll) => {
      const userVote = (votes || []).find((vote) => vote.pollId === poll.pollId);
      return pollBuilder(poll, userId).withUserVote(userVote).build();
    });
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting direct polls for user ${userId}`);
  }
  return result;
};
