import polls from './polls';
import poll from './poll';
import directPolls from './directPolls';
import withPollAuthorization from './withPollAuthorization';

export default {
  polls,
  poll: withPollAuthorization(poll),
  directPolls,
  // feed: (source, args, context, state) => data.polls,
};
