import { ApolloError } from 'apollo-server-lambda';
import get from '../../../../data/polls/get';
import pollBuilder from './pollBuilder';

export default async (_, { pollId }, { currentUserId, loaders }) => {
  let result;
  try {
    const pollData = await Promise.all([loaders.poll.load(pollId), loaders.vote.load({ userId: currentUserId, pollId })]);
    if (pollData[0]) {
      result = pollBuilder(pollData[0], currentUserId).withUserVote(pollData[1]).build();
    }
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting poll ${pollId}`);
  }
  return result;
};
