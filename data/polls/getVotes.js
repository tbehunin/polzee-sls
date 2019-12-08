const getVotes = async (db, userId, pollIds) => {
  const params = {
    RequestItems: {
      [process.env.dbPolls]: {
        Keys: pollIds.map((pollId) => ({
          hashKey: `UserId:${userId}`,
          sortKey: `Vote:${pollId}`,
        })),
      },
    },
  };

  const data = await db.batchGet(params).promise();
  return ((data || {}).Responses || {})[process.env.dbPolls] || [];
};

module.exports = getVotes;
