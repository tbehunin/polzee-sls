module.exports = async (db, userId, excludePrivate) => {
  // Default to return all polls
  const params = {
    TableName: process.env.dbPolls,
    KeyConditionExpression: 'hashKey = :hk AND begins_with(sortKey, :sk)',
    ExpressionAttributeValues: {
      ':hk': `UserId:${userId}`,
      ':sk': 'Poll:',
    },
  };

  if (excludePrivate) {
    params.IndexName = 'PollsHashKeyScopeIdx';
    params.KeyConditionExpression = 'hashKey = :hk AND begins_with(scope, :sk)';
    params.ExpressionAttributeValues[':sk'] = 'Public:';
  }

  const data = await db.query(params).promise();
  return (data || {}).Items;
};
