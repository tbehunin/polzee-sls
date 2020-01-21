import polls from './pollsResolver';
import directPolls from './directPollsResolver';

export default {
  polls,
  poll: (_, { pollId }) => ({ pollId }),
  directPolls,
  user: (_, { userId }) => ({ userId }),
  // feed: (source, args, context, state) => data.polls,
};
