const { ApolloError } = require('apollo-server-lambda');
const dbPolls = require('../../../../data/polls');

module.exports = async (_, args, { userId }) => {
  const idToQuery = args.userId || userId;
  let result;
  try {
    result = await dbPolls.getAll(idToQuery, idToQuery !== userId);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting polls for user ${idToQuery}`);
  }
  return result;
};
