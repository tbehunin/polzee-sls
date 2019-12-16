const pollBuilder = (poll, currentUserId) => {
  const obj = {};

  return {
    withUserVote(userVote) {
      obj.userVote = userVote;
      return this;
    },
    build: () => {
      let pollBuild;
      const {
        userId: pollUserId,
        pollId: pollPollId,
        expireTimestamp: pollExpireTimestamp,
        choices: pollChoices = [],
      } = poll;

      if (pollUserId) {
        // Hide the acceptable answers if:
        // - the current user isn't the author of this poll and
        // - it's not expired and
        // - they haven't voted for it yet
        const now = Date.now();
        const isAuthor = pollUserId === currentUserId;
        const hasExpired = pollExpireTimestamp < now;
        const {
          userVote: {
            userId: voteUserId,
            pollId: votePollId,
            selection: voteSelection = [],
          } = {},
        } = obj;
        const hasVoted = voteUserId && voteUserId === currentUserId
          && votePollId && votePollId === pollPollId;
        const hideAcceptable = !isAuthor && !hasExpired && !hasVoted;

        // Merge the vote into each choice
        pollBuild = {
          ...poll,
          choices: pollChoices.map((choice) => {
            // Default choice value if they have at least voted on the poll
            const defaultSelected = hasVoted ? false : undefined;
            return {
              ...choice,
              selected: (hasVoted && !!voteSelection.find((selection) => selection === choice.order))
                || defaultSelected,
              acceptable: hideAcceptable ? undefined : choice.acceptable,
            };
          }),
        };
      }

      return pollBuild;
    },
  };
};

export default pollBuilder;
