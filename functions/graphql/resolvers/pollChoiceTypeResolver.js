export default {
  acceptable: async ({ poll, ...choice }, _, { currentUserId, loaders }) => {
    // Show the acceptable value if:
    // - the current user is the author of this poll OR
    // - the poll has expired OR
    // - the current user has voted on the poll
    const now = Date.now();
    const isAuthor = poll.userId === currentUserId;
    const hasExpired = poll.expireTimestamp < now;

    if (isAuthor || hasExpired) {
      return choice.acceptable;
    }

    const vote = await loaders.vote.load({ userId: currentUserId, pollId: poll.pollId });
    return vote ? choice.acceptable : undefined;
  },
  selected: async ({ poll, ...choice }, _, { currentUserId, loaders }) => {
    const vote = await loaders.vote.load({ userId: currentUserId, pollId: poll.pollId });

    if (!vote) {
      return undefined;
    }

    return !!vote.selection.find((selection) => selection === choice.order) || false;
  },
};
