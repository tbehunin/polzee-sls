import data from '../..';

const put = async (params) => {
  const pollParams = {
    ...params,
    TableName: process.env.dbPolls,
  };
  console.log('params before putting', pollParams);
  return data.db.put(pollParams).promise();
};

export default {
  vote: async (userId, pollId, selection) => {
    const params = {
      Item: {
        hashKey: `UserId:${userId}`,
        sortKey: `Vote:${pollId}`,
        userId,
        pollId,
        selection,
      },
    };
    await put(params);
    return params.Item;
  },
  comment: async (userId, pollId, comment) => {
    const timestamp = Date.now();
    const params = {
      Item: {
        hashKey: `UserId:${userId}`,
        sortKey: `Comment:${pollId}:${timestamp}`,
        hashData1: `PollId:${pollId}`,
        sortData1: `Comment:${timestamp}:${userId}`,
        userId,
        pollId,
        comment,
        createTimestamp: timestamp,
      },
    };
    await put(params);
    return params.Item;
  },
};
