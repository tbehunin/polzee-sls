module.exports = async (db, userId) => {
  const params1 = {
    ExpressionAttributeValues: {
      ':hk': `UserId:${userId}`,
      ':sk': 'DirectPoll:',
    },
    KeyConditionExpression: 'hashKey = :hk and begins_with(sortKey, :sk)',
    TableName: process.env.dbPolls,
  };

  let result;
  const data1 = await db.query(params1).promise();
  const dpList = (data1 || {}).Items || [];
  if (dpList.length) {
    const params2 = {
      RequestItems: {
        [process.env.dbPolls]: {
          Keys: dpList.map((item) => ({
            hashKey: `UserId:${item.fromUserId}`,
            sortKey: `Poll:${item.createTimestamp}`,
          })),
        },
      },
    };
    const data2 = await db.batchGet(params2).promise();
    result = ((data2 || {}).Responses || {})[process.env.dbPolls] || [];
  }
  return result;
};
