import { ValidationError, ApolloError } from 'apollo-server-lambda';
import get from '../../../../data/polls/get';
import put from '../../../../data/polls/put';
import pollBuilder from '../query/pollBuilder';

export default async (_, { input }, { userId }) => {
  // Validate input that graphQL doesn't already automatically handle
  if (!input.selection.length) {
    throw new ValidationError('One or more selections required');
  }

  let pollData;
  try {
    pollData = await Promise.all([
      get.poll(input.pollId),
      get.vote(userId, input.pollId),
    ]);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error retrieving poll information for userId '${userId}' and pollId '${input.pollId}'`);
  }

  // Ensure the poll exists
  if (!pollData[0]) {
    throw new ValidationError(`PollId '${input.pollId}' not found`);
  }

  // Ensure the user hasn't voted on it before
  if (pollData[1]) {
    throw new ValidationError(`User already voted on pollId '${input.pollId}'`);
  }

  // Ensure they are valid selections
  input.selection.forEach((selection) => {
    if (selection <= 0 || selection > pollData[0].choices.length) {
      throw new ValidationError(`Invalid selection '${selection}'`);
    }
  });

  let result;
  try {
    const voteResult = await put.vote(userId, input.pollId, input.selection);
    console.log(`voteResult: ${JSON.stringify(voteResult)}`);

    result = pollBuilder(pollData[0], userId).withUserVote(voteResult).build();
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error voting on pollId '${input.pollId}' for userId '${userId}'`);
  }
  return result;
};
