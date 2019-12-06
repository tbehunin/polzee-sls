const polls = require('./polls');
const poll = require('./poll');
const directPolls = require('./directPolls');
const withAnswerProtection = require('./withAnswerProtection');
const withPollAuthorization = require('./withPollAuthorization');

module.exports = {
  polls,
  poll: withAnswerProtection(withPollAuthorization(poll)),
  directPolls,
  // feed: (source, args, context, state) => data.polls,
};
