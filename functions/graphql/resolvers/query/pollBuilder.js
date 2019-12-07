const pollBuilder = (poll, currentUserId) => {
  const obj = {};

  return {
    withUserVote(userVote) {
      obj.userVote = userVote;
      return this;
    },
    build: () => {
      let pollBuild;

      if (poll) {
        // Hide the acceptable answers if:
        // - the current user isn't the author of this poll and
        // - it's not expired and
        // - they haven't voted for it yet
        const now = Date.now();
        const isAuthor = poll.userId === currentUserId;
        const hasExpired = now < poll.expireTimestamp;
        const hasVoted = !!obj.userVote;
        const hideAcceptable = !isAuthor && !hasExpired && !hasVoted;

        // Merge the vote into each choice
        pollBuild = {
          ...poll,
          choices: poll.choices.map((choice) => {
            // Default choice value if they have at least voted on the poll
            const defaultSelected = obj.userVote ? false : undefined;
            return {
              ...choice,
              selected: !!(((obj.userVote || {}).selection || [])
                .find((selection) => selection === choice.order)) || defaultSelected,
              acceptable: hideAcceptable ? undefined : choice.acceptable,
            };
          }),
        };
      }

      return pollBuild;
    },
  };
};

module.exports = pollBuilder;
