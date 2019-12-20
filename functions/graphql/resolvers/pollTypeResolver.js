import { ApolloError } from 'apollo-server-lambda';
import get from '../../../data/polls/get';

export default {
  user: ({ userId } = {}) => {
    let user;
    if (userId) {
      try {
        user = get.user(userId);
      } catch (error) {
        console.error(error);
        throw new ApolloError(`Error getting user ${userId}`);
      }
    }
    return user;
  },
};
