const { ApolloServer, gql } = require('apollo-server-lambda');
const data = require('../data');
const dbPolls = require('../dal/polls');

const typeDefs = gql`
    type PollChoice {
        order: Int!
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
        polls: [Poll]
    }
    type Mutation {
        createPoll(input: PollInput): Poll
    }
`;

const resolvers = {
  Query: {
    polls: (source, args, context, state) => data.polls,
    // directPolls: (source, args, context, state) => data.polls,
    // feed: (source, args, context, state) => data.polls,
  },
  Mutation: {
    createPoll: async (source, { input }, context, state) =>
        await dbPolls.add({ ...input, userId: context.event.requestContext.authorizer.claims.sub }),
  },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: options => options,
});

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});