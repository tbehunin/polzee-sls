const uuidv1 = require('uuid/v1');

module.exports = async (db, input) => {
  const timestamp = Date.now();
  const newPoll = {
    ...input,
    pollId: uuidv1(),
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

  await db.batchWrite(params).promise();
  return newPoll;
};