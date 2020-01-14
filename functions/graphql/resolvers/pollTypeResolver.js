import { ApolloError } from 'apollo-server-lambda';

export default {
  user: async ({ userId } = {}, _, { loaders }) => {
    let user;
    if (userId) {
      try {
        user = await loaders.user.load(userId);
      } catch (error) {
        console.error(error);
        throw new ApolloError(`Error getting user ${userId}`);
      }
    }
    return user;
  },
};
