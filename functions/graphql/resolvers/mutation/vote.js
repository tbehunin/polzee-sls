import { ValidationError, ApolloError, ForbiddenError } from 'apollo-server-lambda';
import put from '../../../../data/polls/put';

export default async (_, { input }, { currentUserId, loaders }) => {
  // Validate input that graphQL doesn't already automatically handle
  if (!input.selection.length) {
    throw new ValidationError('One or more selections required');
  }

  let pollData;
  try {
    pollData = await Promise.all([
      loaders.poll.load(input.pollId),
      loaders.vote.load({ userId: currentUserId, pollId: input.pollId }),
    ]);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error retrieving poll information for userId '${currentUserId}' and pollId '${input.pollId}'`);
  }

  const [poll, vote] = pollData;

  // Ensure the poll exists
  if (!poll) {
    throw new ValidationError(`PollId '${input.pollId}' not found`);
  }

  // Ensure the user hasn't voted on it before
  if (vote) {
    throw new ValidationError(`User already voted on pollId '${input.pollId}'`);
  }

  // Validate user has access to vote on this
  if (poll.userId !== currentUserId
    && poll.sharedWith && poll.sharedWith.length > 0
    && !poll.sharedWith.includes(currentUserId)) {
    throw new ForbiddenError('Unauthorized');
  }

  // Validate the poll hasn't expired
  if (poll.expireTimestamp > Date.now()) {
    throw new ValidationError(`PollId '${input.pollId}' has already expired`);
  }

  // Ensure they are valid selections
  input.selection.forEach((selection) => {
    if (selection <= 0 || selection > poll.choices.length) {
      throw new ValidationError(`Invalid selection '${selection}'`);
    }
  });

  let result;
  try {
    const voteResult = await put.vote(currentUserId, input.pollId, input.selection);
    console.log(`voteResult: ${JSON.stringify(voteResult)}`);

    // Clear the cache now and return a fresh poll
    loaders.poll.clear(input.pollId);
    loaders.vote.clear({ userId: currentUserId, pollId: input.pollId });

    result = loaders.poll.load(input.pollId);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error voting on pollId '${input.pollId}' for userId '${currentUserId}'`);
  }
  return result;
};
