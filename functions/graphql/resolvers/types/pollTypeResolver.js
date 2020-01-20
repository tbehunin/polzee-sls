import { ApolloError } from 'apollo-server-lambda';
import query from '../../../../data/polls/query';

const pollService = {
  getPoll: async (pollId, pollLoader) => {
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
    return poll;
  },
};

const pollProps = ['pollId', 'createTimestamp', 'question', 'sharedWith', 'expireTimestamp']
  .reduce((acc, prop) => {
    acc[prop] = async ({ pollId }, _, { loaders }) => {
      const poll = await pollService.getPoll(pollId, loaders.poll);
      return poll[prop];
    };
    return acc;
  }, {});

export default {
  ...pollProps,
  choices: async ({ pollId }, _, { loaders }) => {
    // Some choice props need info from the poll in order to validate and resolve properly
    // so send the poll data along with EACH choice.
    const poll = await pollService.getPoll(pollId, loaders.poll);
    return (poll.choices || []).map((choice) => ({ poll, ...choice }));
  },
  user: async ({ pollId }, _, { loaders }) => {
    const poll = await pollService.getPoll(pollId, loaders.poll);
    return { userId: poll.userId };
  },
  comments: async ({ pollId }, _, { loaders }) => {
    const poll = await pollService.getPoll(pollId, loaders.poll);
    return query.comments(poll.pollId);
  },
};
