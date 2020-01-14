import { ApolloError } from 'apollo-server-lambda';
import get from '../../../../data/polls/get';
import pollBuilder from './pollBuilder';

export default async (_, { pollId }, context) => {
  let result;
  try {
    const pollData = await Promise.all([get.poll(pollId), get.vote(context.currentUserId, pollId)]);
    if (pollData[0]) {
      result = pollBuilder(pollData[0], context.currentUserId).withUserVote(pollData[1]).build();
    }
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting poll ${pollId}`);
  }
  return result;
};
