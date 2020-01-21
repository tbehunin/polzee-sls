import { ApolloError } from 'apollo-server-lambda';
import query from '../../../../data/polls/query';

const basicPropResolvers = ['username', 'fullName', 'email', 'bio', 'private'].reduce((acc, prop) => {
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

const followResolvers = ['followers', 'following'].reduce((acc, key) => {
  acc[key] = async ({ userId }) => {
    let result;
    try {
      const followList = await query[key](userId);
      result = followList.map((item) => ({ userId: item.otherUserId }));
    } catch (error) {
      console.error(error);
      throw new ApolloError(`Error getting ${key} for user ${userId}`);
    }
    return result;
  };
  return acc;
}, {});

export default {
  ...basicPropResolvers,
  ...followResolvers,
};
