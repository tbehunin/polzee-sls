import { ApolloError } from 'apollo-server-lambda';
import pollService from '../../../../services/pollService';

export default async (_, { input }, { currentUserId }) => {
  let result;
  try {
    result = await pollService.saveDraft({ ...input, userId: currentUserId });
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error creating poll for user ${currentUserId}`);
  }
  return result;
};
