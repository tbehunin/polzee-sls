import { UserInputError, ApolloError } from 'apollo-server-lambda';
import toggle from '../../../../data/polls/toggle';

export default async (_, { userId }, { currentUserId, loaders }) => {
  // Validate userId is different from currentUserId
  if (userId === currentUserId) {
    throw new UserInputError(`Invalid - cannot follow oneself '${userId}'`);
  }

  // Validate userId exists
  const followUser = await loaders.user.load(userId);
  if (!followUser) {
    throw new UserInputError(`UserId '${userId}' not found`);
  }

  let result;
  try {
    const toggleResult = await toggle.follow(currentUserId, userId);
    console.log(`toggleResult: ${JSON.stringify(toggleResult)}`);

    // Clear the cache now and return a fresh poll
    loaders.user.clear(userId);
    result = await loaders.user.load(userId);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error toggling follow of userId '${userId}' for userId '${currentUserId}'`);
  }
  return result;
};
