module.exports = async (db, input) => {
  const timestamp = Date.now();
  const newPoll = {
    ...input,
    hashKey: `UserId:${input.userId}`,
    sortKey: `Poll:${timestamp}`,
    choices: input.choices.map((choice, idx) => ({
      ...choice,
      order: idx + 1,
    })),
    createTimestamp: timestamp,
    sharedWithCount: (input.sharedWith || []).length,
  };
  const params = {
    RequestItems: {
      [process.env.dbPolls]: [{
        PutRequest: {
          Item: newPoll,
        },
      }].concat(newPoll.sharedWith.map((userId) => ({
        PutRequest: {
          Item: {
            hashKey: `UserId:${userId}`,
            sortKey: `DirectPoll:${timestamp}`,
            fromUserId: input.userId,
            createTimestamp: timestamp,
          },
        },
      }))),
    },
  };

  try {
    const existingData = await db.batchWrite(params).promise();
    return newPoll;
  } catch (error) {
    console.error(error);
  }
};
