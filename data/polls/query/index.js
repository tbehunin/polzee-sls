import data from '../..';

const query = async (params) => {
  const pollParams = {
    ...params,
    TableName: process.env.dbPolls,
  };
  const result = await data.db.query(pollParams).promise();
  console.log('query result', result);
  return (result || {}).Items;
};

export default {
  polls: async (userId) => {
    const params = {
      KeyConditionExpression: 'hashKey = :hk AND begins_with(sortKey, :sk)',
      ExpressionAttributeValues: {
        ':hk': `UserId:${userId}`,
        ':sk': 'Poll:',
      },
    };
    return query(params);
  },
  publicPolls: async (userId) => {
    const params = {
      IndexName: 'PollsHashKeyScopeIdx',
      KeyConditionExpression: 'hashKey = :hk AND begins_with(#scope, :sk)',
      ExpressionAttributeNames: {
        '#scope': 'scope',
      },
      ExpressionAttributeValues: {
        ':hk': `UserId:${userId}`,
        ':sk': 'Public:',
      },
    };
    return query(params);
  },
  directPolls: async (userId) => {
    const params = {
      ExpressionAttributeValues: {
        ':hk': `UserId:${userId}`,
        ':sk': 'DirectPoll:',
      },
      KeyConditionExpression: 'hashKey = :hk and begins_with(sortKey, :sk)',
    };
    return query(params);
  },
  followers: async (userId) => {
    const params = {
      ExpressionAttributeValues: {
        ':hk': `UserId:${userId}`,
        ':sk': 'Follower:',
      },
      KeyConditionExpression: 'hashKey = :hk and begins_with(sortKey, :sk)',
    };
    return query(params);
  },
  following: async (userId) => {
    const params = {
      ExpressionAttributeValues: {
        ':hk': `UserId:${userId}`,
        ':sk': 'Following:',
      },
      KeyConditionExpression: 'hashKey = :hk and begins_with(sortKey, :sk)',
    };
    return query(params);
  },
  follower: async (userId, otherUserId) => {
    const params = {
      IndexName: 'PollsHashKeySortData1Idx',
      KeyConditionExpression: 'hashKey = :hk AND sortData1 = :sk',
      ExpressionAttributeValues: {
        ':hk': `UserId:${userId}`,
        ':sk': `FollowOtherUserId:${otherUserId}`,
      },
    };
    const follow = await query(params);
    return follow[0];
  },
};
