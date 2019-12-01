const dbPolls = require('../../../../data/polls');

module.exports = async (_, args, { userId }) => {
  const idToQuery = args.userId || userId;
  let result;
  try {
    result = dbPolls.getAll(idToQuery, idToQuery !== userId);
  } catch (error) {
    console.error(error);
  }
  return result;
};
