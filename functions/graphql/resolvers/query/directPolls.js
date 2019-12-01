const { ApolloError } = require('apollo-server-lambda');
const dbPolls = require('../../../../data/polls');

module.exports = async (_, args, { userId }) => {
  let result;
  try {
    result = await dbPolls.getAllDirect(userId);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error getting direct polls for user ${userId}`);
  }
  return result;
};
