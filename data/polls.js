const dynamodb = require('serverless-dynamodb-client');

module.exports = ({
  add: async (input) => {
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
      const existingData = await dynamodb.doc.batchWrite(params).promise();
      return newPoll;
    } catch (error) {
      console.error(error);
    }
  },
  get: async (userId, createTimestamp) => {
    const params = {
      Key: {
        hashKey: `UserId:${userId}`,
        sortKey: `Poll:${createTimestamp}`,
      },
      TableName: process.env.dbPolls,
    };

    try {
      const data = await dynamodb.doc.get(params).promise();
      return (data || {}).Item;
    } catch (error) {
      console.error(error);
    }
  },
  getAll: async (userId, excludePrivate) => {
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
      const data = await dynamodb.doc.query(params).promise();
      return (data || {}).Items;
    } catch (error) {
      console.error(error);
    }
  },
  getAllDirect: async (userId) => {
    const params1 = {
      ExpressionAttributeValues: {
        ':hk': `UserId:${userId}`,
        ':sk': 'DirectPoll:',
      },
      KeyConditionExpression: 'hashKey = :hk and begins_with(sortKey, :sk)',
      TableName: process.env.dbPolls,
    };

    try {
      const data1 = await dynamodb.doc.query(params1).promise();
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
        const data2 = await dynamodb.doc.batchGet(params2).promise();
        return ((data2 || {}).Responses || {})[process.env.dbPolls] || [];
      }
      return null;
    } catch (error) {
      console.error(error);
    }
  },
});
