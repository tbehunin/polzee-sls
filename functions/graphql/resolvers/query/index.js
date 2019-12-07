const polls = require('./polls');
const poll = require('./poll');
const directPolls = require('./directPolls');
const withPollAuthorization = require('./withPollAuthorization');

module.exports = {
  polls,
  poll: withPollAuthorization(poll),
  directPolls,
  // feed: (source, args, context, state) => data.polls,
};
