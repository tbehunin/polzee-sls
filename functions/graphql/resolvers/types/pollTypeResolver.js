import { ApolloError, ForbiddenError } from 'apollo-server-lambda';
import query from '../../../../data/polls/query';

const pollService = {
  getPoll: async (pollId, currentUserId, pollLoader) => {
    let poll;
    try {
      poll = await pollLoader.load(pollId);
    } catch (error) {
      console.error(error);
      throw new ApolloError(`Error getting poll ${pollId}`);
    }
    if (!poll) {
      throw new ApolloError(`Poll ${pollId} not found`);
    }

    // Validate user has access to view this poll
    if (poll.userId !== currentUserId
      && poll.sharedWith && poll.sharedWith.length > 0
      && !poll.sharedWith.includes(currentUserId)) {
      throw new ForbiddenError('Unauthorized');
    }

    return poll;
  },
};

const basicPropResolvers = ['pollId', 'createTimestamp', 'question', 'sharedWith', 'expireTimestamp']
  .reduce((acc, prop) => {
    acc[prop] = async ({ pollId }, _, { currentUserId, loaders }) => {
      const poll = await pollService.getPoll(pollId, currentUserId, loaders.poll);
      return poll[prop];
    };
    return acc;
  }, {});

const toManyPropResolvers = ['comments', 'likes', 'votes']
  .reduce((acc, prop) => {
    acc[prop] = async ({ pollId }, _, { currentUserId, loaders }) => {
      const poll = await pollService.getPoll(pollId, currentUserId, loaders.poll);
      return query[prop](poll.pollId);
    };
    return acc;
  }, {});

export default {
  ...basicPropResolvers,
  ...toManyPropResolvers,
  choices: async ({ pollId }, _, { currentUserId, loaders }) => {
    // Some choice props need info from the poll in order to validate and resolve properly
    // so send the poll data along with EACH choice.
    const poll = await pollService.getPoll(pollId, currentUserId, loaders.poll);
    return (poll.choices || []).map((choice) => ({ poll, ...choice }));
  },
  user: async ({ pollId }, _, { currentUserId, loaders }) => {
    const poll = await pollService.getPoll(pollId, currentUserId, loaders.poll);
    return { userId: poll.userId };
  },
};
