'use strict';

const { ApolloServer, gql } = require('apollo-server-lambda');
const dynamodb = require('serverless-dynamodb-client');
const data = require('../data');

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

module.exports.lambdaArgs = async (event, context) => {
    const response = {
        statusCode: 200,
        headers: { ...corsHeaders },
        body: JSON.stringify({ event, context }),
    };
    return response;
};

// ************* GRAPHQL STUFFS ************* //

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type PollChoice {
        id: String!
        value: String!
        acceptable: Boolean!
    }
    type Poll {
        id: String!
        question: String!
        choices: [PollChoice]!
    }
    type Query {
        hello: String
        polls: [Poll]
    }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    polls: (source, args, context, state) => data.polls,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphql = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
