import data from '../..';

const batchGet = async (keys) => {
  const pollParams = {
    RequestItems: {
      [process.env.dbPolls]: {
        Keys: keys,
      },
    },
  };
  const result = await data.db.batchGet(pollParams).promise();
  console.log('batchGet keys', keys, 'result', result);
  return ((result || {}).Responses || {})[process.env.dbPolls] || [];
};

export default {
  polls: async (pollIdList) => {
    const keys = pollIdList.map((pollId) => {
      const pollIdSplit = pollId.split(':');
      return {
        hashKey: `UserId:${pollIdSplit[0]}`,
        sortKey: `Poll:${pollIdSplit[1]}`,
      };
    });
    return batchGet(keys);
  },
  votes: async (userId, pollIds) => {
    const keys = pollIds.map((pollId) => ({
      hashKey: `UserId:${userId}`,
      sortKey: `Vote:${pollId}`,
    }));
    return batchGet(keys);
  },
  users: async (userIdList) => {
    const keys = userIdList.map((userId) => ({
      hashKey: `UserId:${userId}`,
      sortKey: 'Profile',
    }));
    return batchGet(keys);
  },
};
