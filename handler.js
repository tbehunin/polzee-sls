'use strict';

const dynamodb = require('serverless-dynamodb-client');
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

module.exports.hello = async (event, context) => {
    const params = {
        TableName: process.env.MyTable,
        Item: {
            'MyId': {
                S: new Date().toISOString(),
            },
        },
    };
    let result;
    try {
        result = await dynamodb.raw.putItem(params).promise();
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

module.exports.generateToken = async (event, context) => {
    const response = {
        statusCode: 200,
        headers: { ...corsHeaders },
        body: JSON.stringify({
            todd: 'was here',
            input: event,
        }),
    };
    return response;
};
