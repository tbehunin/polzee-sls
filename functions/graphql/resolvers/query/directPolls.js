const dbPolls = require('../../../../data/polls');

module.exports = (_, args, { userId }) => {
  let result;
  try {
    result = dbPolls.getAllDirect(userId);
  } catch (error) {
    console.error(error);
  }
  return result;
};
