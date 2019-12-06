const dbPolls = require('../../../../data/polls');

const withAnswerProtection = (resolver) => {
  const authResolver = async (source, args, context, state) => {
    const data = await resolver(source, args, context, state);

    if (data) {
      const now = Date.now();
      const userVote = await dbPolls.getUserVote(context.userId, data.pollId);

      // Hide the acceptable answers if:
      // - the current user isn't the author of this poll and
      // - it's not expired and
      // - they haven't voted for it yet
      const hideAcceptable = data.userId !== context.userId && data.expireTimestamp > now
        && !userVote;

      // Merge the vote into each choice
      data.choices = data.choices.map((choice) => {
        // Default choice value if they have at least voted on the poll
        const defaultSelected = userVote ? false : undefined;
        return {
          ...choice,
          selected: !!(((userVote || {}).selection || [])
            .find((selection) => selection === choice.order)) || defaultSelected,
          acceptable: hideAcceptable ? undefined : choice.acceptable,
        };
      });
    }

    return data;
  };
  return authResolver;
};

module.exports = withAnswerProtection;
