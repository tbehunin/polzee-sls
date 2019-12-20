import data from '../..';

const get = async (params) => {
  const pollParams = {
    ...params,
    TableName: process.env.dbPolls,
  };
  const result = await data.db.get(pollParams).promise();
  console.log('get result', result);
  return (result || {}).Item;
};

export default {
  poll: async (pollId) => {
    const pollIdSplit = pollId.split(':');
    const params = {
      Key: {
        hashKey: `UserId:${pollIdSplit[0]}`,
        sortKey: `Poll:${pollIdSplit[1]}`,
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