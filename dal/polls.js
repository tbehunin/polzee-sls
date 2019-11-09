const dynamodb = require('serverless-dynamodb-client');
const uuid = require('uuid/v1');

module.exports = ({
    add: async input => {
        const id = uuid();
        const params = {
            TableName: process.env.dbPolls,
            Item: {
                id: { S: id },
                question: { S: input.question },
                choices: {
                    L: input.choices.map(choice => ({
                        M: {
                            value: { S: choice.value },
                            acceptable: { BOOL: choice.acceptable },
                        },
                    })),
                },
            },
            ReturnValues: 'ALL_OLD',
        };
        let result;
        try {
            const oldData = await dynamodb.raw.putItem(params).promise();
            result = { ...oldData, ...input, id };
        } catch (error) {
            result = error;
        }
        
        return result;
    }
});
