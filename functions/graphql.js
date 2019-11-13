const { ApolloServer, gql, ValidationError } = require('apollo-server-lambda');
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
        sharedWith: [ID]
        expireTimestamp: Int!
        createTimestamp: Int!
    }
    input PollChoiceInput {
        value: String!
        acceptable: Boolean!
    }
    input PollInput {
        question: String!
        choices: [PollChoiceInput!]!
        sharedWith: [ID!]
        expireTimestamp: Int!
    }
    type Query {
        polls: [Poll]
        poll(id: ID!): Poll
    }
    type Mutation {
        createPoll(input: PollInput): Poll
    }
`;

const resolvers = {
  Query: {
    polls: () => data.polls,
    poll: async (_, { id }) => dbPolls.getById(id),
    // directPolls: (source, args, context, state) => data.polls,
    // feed: (source, args, context, state) => data.polls,
  },
  Mutation: {
    createPoll: async (_, { input }, context) => {
      // Validate input that graphQL doesn't already automatically handle
      if (input.choices.length < 2 || input.choices.length > 6) {
        throw new ValidationError('Two or more choices required - not to exceed six');
      }
      if (input.sharedWith && input.sharedWith.length > 25) {
        throw new ValidationError('Cannot share with more than 25 users');
      }
      return dbPolls.add({ ...input, userId: context.event.requestContext.authorizer.claims.sub });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (options) => options,
});

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
