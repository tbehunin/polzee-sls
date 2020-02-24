
import { ApolloError } from 'apollo-server-lambda';
import pollService from '../../../../services/pollService';

export default async (_, args, { currentUserId }) => {
  let result;
  try {
    result = await pollService.draftPoll(currentUserId);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error creating a draft poll for user ${currentUserId}`);
  }
  return result;
};
