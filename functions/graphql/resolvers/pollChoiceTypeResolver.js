import { ApolloError } from 'apollo-server-lambda';

export default {
  acceptable: async ({ poll, ...choice }, _, { currentUserId, loaders }) => {
    // Show the acceptable value if:
    // - the current user is the author of this poll OR
    // - the poll has expired OR
    // - the current user has voted on the poll
    let result;
    try {
      const now = Date.now();
      const isAuthor = poll.userId === currentUserId;
      const hasExpired = poll.expireTimestamp < now;

      if (isAuthor || hasExpired) {
        return choice.acceptable;
      }

      const vote = await loaders.vote.load({ userId: currentUserId, pollId: poll.pollId });
      result = vote ? choice.acceptable : undefined;
    } catch (error) {
      throw new ApolloError(`Error getting acceptable value for user ${currentUserId} and pollId ${poll.pollId}`);
    }
    return result;
  },
  selected: async ({ poll, ...choice }, _, { currentUserId, loaders }) => {
    let result;
    try {
      const vote = await loaders.vote.load({ userId: currentUserId, pollId: poll.pollId });
      if (vote) {
        result = !!vote.selection.find((selection) => selection === choice.order) || false;
      }
    } catch (error) {
      throw new ApolloError(`Error getting selected value for user ${currentUserId} and pollId ${poll.pollId}`);
    }
    return result;
  },
};
