const data = require('../../../data');

const get = async (params) => {
  const pollParams = {
    ...params,
    TableName: process.env.dbPolls,
  };
  const result = await data.db.get(pollParams).promise();
  console.log('get result', result);
  return (result || {}).Item;
};

module.exports = {
  poll: async (userId, createTimestamp) => {
    const params = {
      Key: {
        hashKey: `UserId:${userId}`,
        sortKey: `Poll:${createTimestamp}`,
      },
    };
    return get(params);
  },
  vote: async (userId, pollId) => {
    const params = {
      Key: {
        hashKey: `UserId:${userId}`,
        sortKey: `Vote:${pollId}`,
      },
    };
    return get(params);
  },
};
