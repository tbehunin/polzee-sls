import { ValidationError, ApolloError, ForbiddenError } from 'apollo-server-lambda';
import toggle from '../../../../data/polls/toggle';

export default async (_, { pollId }, { currentUserId, loaders }) => {
  // Validate poll exists
  let poll;
  try {
    poll = await loaders.poll.load(pollId);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error retrieving poll information for userId '${currentUserId}' and pollId '${pollId}'`);
  }

  if (!poll) {
    throw new ValidationError(`PollId '${pollId}' not found`);
  }

  // Validate user has access to like it
  if (poll.userId !== currentUserId
    && poll.sharedWith && poll.sharedWith.length > 0
    && !poll.sharedWith.includes(currentUserId)) {
    throw new ForbiddenError('Unauthorized');
  }

  let result;
  try {
    const toggleResult = await toggle.like(currentUserId, pollId);
    console.log(`toggleResult: ${JSON.stringify(toggleResult)}`);

    // Clear the cache now and return a fresh poll
    loaders.poll.clear(pollId);

    result = loaders.poll.load(pollId);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error toggling like of pollId '${pollId}' for userId '${currentUserId}'`);
  }
  return result;
};
