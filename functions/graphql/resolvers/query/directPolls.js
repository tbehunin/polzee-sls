const dbPolls = require('../../../../data/polls');

module.exports = async (_, args, { userId }) => dbPolls.getAllDirect(userId);
