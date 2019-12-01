module.exports = async (db, userId, excludePrivate) => {
  const params = {
    KeyConditionExpression: 'hashKey = :hk',
    ExpressionAttributeValues: {
      ':hk': `UserId:${userId}`,
    },
    TableName: process.env.dbPolls,
  };
  if (excludePrivate) {
    params.IndexName = 'PollsHashKeySharedWithCountIdx';
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND sharedWithCount = :sharedWithCount`;
    params.ExpressionAttributeValues = {
      ...params.ExpressionAttributeValues,
      ':sharedWithCount': 0,
    };
  }

  try {
    const data = await db.query(params).promise();
    return (data || {}).Items;
  } catch (error) {
    console.error(error);
  }
};
