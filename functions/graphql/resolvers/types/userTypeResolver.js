import { ApolloError } from 'apollo-server-lambda';

export default ['username', 'fullName', 'email'].reduce((acc, prop) => {
  acc[prop] = async ({ userId }, _, { loaders }) => {
    let user;
    try {
      user = await loaders.user.load(userId);
    } catch (error) {
      console.error(error);
      throw new ApolloError(`Error getting ${prop} for user ${userId}`);
    }
    if (!user) {
      throw new ApolloError(`User ${userId} not found`);
    }

    return user[prop];
  };
  return acc;
}, {});
