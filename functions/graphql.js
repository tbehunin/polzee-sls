const { ApolloServer, gql } = require('apollo-server-lambda');
const data = require('../data');
const dbPolls = require('../dal/polls');

const typeDefs = gql`
    type PollChoice {
        id: ID!
        value: String!
        acceptable: Boolean!
    }
    type Poll {
        id: ID!
        question: String!
        choices: [PollChoice]!
    }
    input PollChoiceInput {
        value: String!
        acceptable: Boolean!
    }
    input PollInput {
        question: String!
        choices: [PollChoiceInput]!
    }
    type Query {
        hello: String
        polls: [Poll]
    }
    type Mutation {
        createPoll(input: PollInput): Poll
    }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    polls: (source, args, context, state) => data.polls,
    // directPolls: (source, args, context, state) => data.polls,
    // feed: (source, args, context, state) => data.polls,
  },
  Mutation: {
    createPoll: async (_, { input }) => await dbPolls.add(input),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});