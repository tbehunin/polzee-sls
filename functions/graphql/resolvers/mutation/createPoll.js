const { ValidationError, ApolloError } = require('apollo-server-lambda');
const dbPolls = require('../../../../data/polls');

module.exports = async (_, { input }, { userId }) => {
  // Validate input that graphQL doesn't already automatically handle
  if (input.choices.length < 2 || input.choices.length > 6) {
    throw new ValidationError('Two or more choices required - not to exceed six');
  }
  if (input.sharedWith && input.sharedWith.length > 25) {
    throw new ValidationError('Cannot share with more than 25 users');
  }

  let result;
  try {
    result = await dbPolls.add({ ...input, userId });
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error creating poll for user ${userId}`);
  }
  return result;
};
