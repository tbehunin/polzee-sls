const dynamodb = require('serverless-dynamodb-client');
const uuid = require('uuid/v1');

module.exports = ({
  add: async (input) => {
    const newPoll = {
      ...input,
      choices: input.choices.map((choice, idx) => ({
        ...choice,
        order: idx + 1,
      })),
      createTimestamp: Date.now(),
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
  getAll: async (userId, excludePrivatePolls) => {
    const params = {
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      TableName: process.env.dbPolls,
    };

    try {
      const data = await dynamodb.doc.query(params).promise();
      return (data || {}).Items;
    } catch (error) {
      console.error(error);
    }
  },
});
