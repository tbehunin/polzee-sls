import { ApolloError } from 'apollo-server-lambda';
import query from '../../../../data/polls/query';

export default ['followers', 'following'].reduce((acc, key) => {
  acc[key] = async (_, args, { currentUserId }) => {
    const idToQuery = args.userId || currentUserId;
    let result;
    try {
      const followList = await query[key](idToQuery);
      result = followList.map((item) => ({ userId: item.otherUserId }));
    } catch (error) {
      console.error(error);
      throw new ApolloError(`Error getting ${key} for user ${idToQuery}`);
    }
    return result;
  };
  return acc;
}, {});
