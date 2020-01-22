import { Base64 } from 'js-base64';
import data from '..';

export default async (input) => {
  const timestamp = Date.now();
  const scope = (input.sharedWith || []).length ? 'Private' : 'Public';
  const pollId = Base64.encode(`${input.userId}:${timestamp}`);
  const newPoll = {
    ...input,
    pollId,
    hashKey: `UserId:${input.userId}`,
    sortKey: `Poll:${timestamp}`,
    sortData1: `${scope}:${timestamp}`,
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
            sortKey: `DirectPoll:${pollId}`,
            sortData1: `DirectPoll:${timestamp}:${pollId}`,
            userId,
            pollId,
            timestamp,
          },
        },
      }))),
    },
  };

  await data.db.batchWrite(params).promise();
  return newPoll;
};
