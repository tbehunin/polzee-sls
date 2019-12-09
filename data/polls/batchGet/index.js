const data = require('../../../data');

const batchGet = async (keys) => {
  const pollParams = {
    RequestItems: {
      [process.env.dbPolls]: {
        Keys: keys,
      },
    },
  };
  const result = await data.db.batchGet(pollParams).promise();
  console.log('batchGet result', result);
  return ((result || {}).Responses || {})[process.env.dbPolls] || [];
};

module.exports = {
  polls: async (hashSortList) => {
    const keys = hashSortList.map((item) => ({
      hashKey: `UserId:${item.userId}`,
      sortKey: `Poll:${item.createTimestamp}`,
    }));
    return batchGet(keys);
  },
  votes: async (userId, pollIds) => {
    const keys = pollIds.map((pollId) => ({
      hashKey: `UserId:${userId}`,
      sortKey: `Vote:${pollId}`,
    }));
    return batchGet(keys);
  },
};
