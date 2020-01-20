import polls from './pollsResolver';
import directPolls from './directPollsResolver';
import followResolvers from './followResolvers';

export default {
  polls,
  poll: (_, { pollId }) => ({ pollId }),
  directPolls,
  user: (_, { userId }) => ({ userId }),
  ...followResolvers,
  // feed: (source, args, context, state) => data.polls,
};
