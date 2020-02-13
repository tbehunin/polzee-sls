import data from '../..';

const del = async (params) => {
  const pollParams = {
    ...params,
    TableName: process.env.dbPolls,
  };
  const result = await data.db.delete(pollParams).promise();
  console.log('delete result', result);
  return (result || {}).Item;
};

export default {
  like: async (userId, pollId) => {
    const params = {
      Key: {
        hashKey: `UserId:${userId}`,
        sortKey: `Like:${pollId}`,
      },
    };
    return del(params);
  },
  follow: async (followerUserId, followingUserId) => {
    const params = {
      Key: {
        hashKey: `UserId:${followerUserId}`,
        sortKey: `Follow:${followingUserId}`,
      },
    };
    return del(params);
  },
};
