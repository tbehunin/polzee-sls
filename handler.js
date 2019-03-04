'use strict';

const AWS = require('aws-sdk');

module.exports.hello = async (event, context) => {
    var dynamodb = new AWS.DynamoDB();
    const params = {
        TableName: process.env.FunSlsTbl,
        Item: {
            'MyId': {
                S: new Date().toISOString(),
            },
        },
    };
    let result;
    try {
        result = await dynamodb.putItem(params).promise();
    } catch (error) {
        result = error;
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            result,
            input: event,
        }),
    };
    
    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
