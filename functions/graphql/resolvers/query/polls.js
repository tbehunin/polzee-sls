import { ApolloError } from 'apollo-server-lambda';
import query from '../../../../data/polls/query';

export default async (_, args, { currentUserId }) => {
  const idToQuery = args.userId || currentUserId;
  let result;
  try {
    const getPolls = idToQuery !== currentUserId ? query.publicPolls : query.polls;
    result = await getPolls(idToQuery);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting polls for user ${idToQuery}`);
  }
  return result;
};
