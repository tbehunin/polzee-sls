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
};
