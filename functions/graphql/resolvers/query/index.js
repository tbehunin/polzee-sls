import polls from './pollsResolver';
import directPolls from './directPollsResolver';
import withPollAuthorization from './withPollAuthorization';

export default {
  polls,
  poll: withPollAuthorization((_, { pollId }) => ({ pollId })),
  directPolls,
  user: (_, { userId }) => ({ userId }),
  // feed: (source, args, context, state) => data.polls,
};
