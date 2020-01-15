import { ApolloError } from 'apollo-server-lambda';
import query from '../../../../data/polls/query';

export default async (_, args, { currentUserId, loaders }) => {
  let result;
  try {
    const directPolls = await query.directPolls(currentUserId);
    const pollData = await loaders.poll.loadMany(directPolls.map((dp) => dp.pollId));
    result = pollData.filter((poll) => poll);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting direct polls for user ${currentUserId}`);
  }
  return result;
};
