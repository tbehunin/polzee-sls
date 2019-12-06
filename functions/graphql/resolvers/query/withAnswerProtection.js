const dbPolls = require('../../../../data/polls');

const withAnswerProtection = (resolver) => {
  const authResolver = async (source, args, context, state) => {
    const data = await resolver(source, args, context, state);

    // Hide the acceptable answers if:
    // - the current user isn't the author of this poll and
    // - it's not expired and
    // - they haven't voted for it yet
    const now = Date.now();
    if (data.userId !== context.userId && data.expireTimestamp > now) {
      const userVote = await dbPolls.getUserVote(context.userId, data.pollId);
      if (!userVote) {
        data.choices = data.choices.map(({ acceptable, ...rest }) => ({ ...rest }));
      }
    }

    return data;
  };
  return authResolver;
};

module.exports = withAnswerProtection;
