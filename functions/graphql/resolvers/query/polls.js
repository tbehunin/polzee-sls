const dbPolls = require('../../../../data/polls');

module.exports = async (_, args, { userId }) => {
  const idToQuery = args.userId || userId;
  return dbPolls.getAll(idToQuery, idToQuery !== userId);
};
