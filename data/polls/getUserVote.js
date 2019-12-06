module.exports = async (db, userId, pollId) => {
  const params = {
    Key: {
      hashKey: `UserId:${userId}`,
      sortKey: `Vote:${pollId}`,
    },
    TableName: process.env.dbPolls,
  };

  const data = await db.get(params).promise();
  return (data || {}).Item;
};
