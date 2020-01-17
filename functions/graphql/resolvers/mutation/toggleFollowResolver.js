import { ValidationError, ApolloError } from 'apollo-server-lambda';
import toggle from '../../../../data/polls/toggle';
import query from '../../../../data/polls/query';

export default async (_, { userId }, { currentUserId, loaders }) => {
  // Validate userId is different from currentUserId
  if (userId === currentUserId) {
    throw new ValidationError(`Invalid - cannot follow oneself '${userId}'`);
  }

  // Validate userId exists
  const followUser = await loaders.user.load(userId);
  if (!followUser) {
    throw new ValidationError(`UserId '${userId}' not found`);
  }

  let result;
  try {
    const toggleResult = await toggle.follow(currentUserId, userId);
    console.log(`toggleResult: ${JSON.stringify(toggleResult)}`);

    const follower = await query.follower(currentUserId, userId);
    result = !!follower;
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error toggling follow of userId '${userId}' for userId '${currentUserId}'`);
  }
  return result;
};
