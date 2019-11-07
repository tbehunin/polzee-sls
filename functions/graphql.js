const { ApolloServer, gql } = require('apollo-server-lambda');
const data = require('../data');

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

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    polls: (source, args, context, state) => data.polls,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});