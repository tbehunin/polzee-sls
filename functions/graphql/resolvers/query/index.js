import polls from './pollsResolver';
import poll from './pollResolver';
import directPolls from './directPollsResolver';
import withPollAuthorization from './withPollAuthorization';

export default {
  polls,
  poll: withPollAuthorization(poll),
  directPolls,
  // feed: (source, args, context, state) => data.polls,
};
