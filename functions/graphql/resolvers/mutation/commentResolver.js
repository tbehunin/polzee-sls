import { ValidationError, ApolloError, ForbiddenError } from 'apollo-server-lambda';
import put from '../../../../data/polls/put';

export default async (_, { pollId, comment }, { currentUserId, loaders }) => {
  let pollData;
  try {
    pollData = await Promise.all([
      loaders.poll.load(pollId),
      loaders.vote.load({ userId: currentUserId, pollId }),
    ]);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error retrieving poll information for userId '${currentUserId}' and pollId '${pollId}'`);
  }

  const [poll, vote] = pollData;

  // Ensure the poll exists
  if (!poll) {
    throw new ValidationError(`PollId '${pollId}' not found`);
  }

  // Validate user has access to comment on this
  if (poll.userId !== currentUserId
    && poll.sharedWith && poll.sharedWith.length > 0
    && !poll.sharedWith.includes(currentUserId)) {
    throw new ForbiddenError('Unauthorized');
  }

  // Commenting is allowed when one of the following are true:
  // - current user is the author of the poll, or
  // - current user has voted on it, or
  // - the poll has expired
  if (poll.userId !== currentUserId && !vote
    && (!poll.expireTimestamp || poll.expireTimestamp > Date.now())) {
    throw new ForbiddenError('Cannot comment when user is not the author, hasn\'t voted on it, '
      + 'or the poll hasn\'t expired yet.');
  }

  let result;
  try {
    result = await put.comment(currentUserId, pollId, comment);

    // Clear the cache now and return a fresh poll
    loaders.poll.clear(pollId);

    result = loaders.poll.load(pollId);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error commenting on pollId '${pollId}' for userId '${currentUserId}'`);
  }
  return result;
};
