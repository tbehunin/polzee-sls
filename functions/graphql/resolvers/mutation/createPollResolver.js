import { ValidationError, ApolloError } from 'apollo-server-lambda';
import add from '../../../../data/polls/add';

export default async (_, { input }, { currentUserId }) => {
  // Validate input that graphQL doesn't already automatically handle
  if (input.choices.length < 2 || input.choices.length > 6) {
    throw new ValidationError('Two or more choices required - not to exceed six');
  }
  if (input.sharedWith && input.sharedWith.length > 25) {
    throw new ValidationError('Cannot share with more than 25 users');
  }

  let result;
  try {
    result = await add({ ...input, userId: currentUserId });
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error creating poll for user ${currentUserId}`);
  }
  return result;
};
