const dynamodb = require('serverless-dynamodb-client');

module.exports = ({
  add: async (input) => {
    const newPoll = {
      ...input,
      choices: input.choices.map((choice, idx) => ({
        ...choice,
        order: idx + 1,
      })),
      createTimestamp: Date.now(),
      sharedWithCount: (input.sharedWith || []).length,
    };
    const params = {
      TableName: process.env.dbPolls,
      Item: newPoll,
      ReturnValues: 'ALL_OLD',
    };

    try {
      const existingData = await dynamodb.doc.put(params).promise();
      return { ...existingData, ...newPoll };
    } catch (error) {
      console.error(error);
    }
  },
  get: async (userId, createTimestamp) => {
    const params = {
      Key: { userId, createTimestamp },
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
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      TableName: process.env.dbPolls,
    };
    if (excludePrivate) {
      params.IndexName = 'PollsUserIdSharedWithCountIdx';
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
});
