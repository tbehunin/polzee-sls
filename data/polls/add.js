import uuidv1 from 'uuid/v1';
import data from '..';

export default async (input) => {
  const timestamp = Date.now();
  const scope = (input.sharedWith || []).length ? 'Private' : 'Public';
  const pollId = uuidv1();
  const newPoll = {
    ...input,
    pollId,
    hashKey: `UserId:${input.userId}`,
    sortKey: `Poll:${timestamp}`,
    scope: `${scope}:${timestamp}`,
    choices: input.choices.map((choice, idx) => ({
      ...choice,
      order: idx + 1,
    })),
    createTimestamp: timestamp,
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
            pollId,
          },
        },
      }))),
    },
  };

  await data.db.batchWrite(params).promise();
  return newPoll;
};
