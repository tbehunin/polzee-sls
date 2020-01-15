import { ApolloError } from 'apollo-server-lambda';

export default async (_, { pollId }, { loaders }) => {
  let result;
  try {
    result = await loaders.poll.load(pollId);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting poll ${pollId}`);
  }
  return result;
};
