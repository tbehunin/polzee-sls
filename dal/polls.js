const dynamodb = require('serverless-dynamodb-client');
const uuid = require('uuid/v1');

module.exports = ({
    add: async input => {
        const newPoll = {
            ...input,
            id: uuid(),
            choices: input.choices.map((choice, idx) => ({
                ...choice,
                order: idx + 1,
            })),
        };
        const params = {
            TableName: process.env.dbPolls,
            Item: {
                id: { S: newPoll.id },
                question: { S: newPoll.question },
                choices: {
                    L: newPoll.choices.map(choice => ({
                        M: {
                            order: { N: `${choice.order}` },
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
            const existingData = await dynamodb.raw.putItem(params).promise();
            result = { ...existingData, ...newPoll };
        } catch (error) {
            result = error;
        }
        
        return result;
    },
    // getById: async input => {
    //     //
    // }
});
