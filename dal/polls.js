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
                id: newPoll.id,
                userId: newPoll.userId,
                question: newPoll.question,
                choices: newPoll.choices.map(choice => ({
                    order: `${choice.order}`,
                    value: choice.value,
                    acceptable: choice.acceptable,
                })),
            },
            ReturnValues: 'ALL_OLD',
        };

        try {
            const existingData = await dynamodb.doc.put(params).promise();
            return { ...existingData, ...newPoll };
        } catch (error) {
            console.error(error);
        }
    },
    // getById: async input => {
    //     //
    // }
});
