const dynamodb = require('serverless-dynamodb-client');
const uuid = require('uuid/v1');

module.exports = ({
  add: async (input) => {
    const newPoll = {
      ...input,
      id: uuid(),
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
  getById: async (id) => {
    const params = {
      Key: { id },
      TableName: process.env.dbPolls,
    };

    try {
      const data = await dynamodb.doc.get(params).promise();
      return (data || {}).Item;
    } catch (error) {
      console.error(error);
    }
  },
});
