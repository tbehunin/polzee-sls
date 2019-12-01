module.exports = async (db, userId, createTimestamp) => {
  const params = {
    Key: {
      hashKey: `UserId:${userId}`,
      sortKey: `Poll:${createTimestamp}`,
    },
    TableName: process.env.dbPolls,
  };

  const data = await db.get(params).promise();
  return (data || {}).Item;
};
