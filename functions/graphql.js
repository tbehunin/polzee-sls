const {
  ApolloServer, gql, ValidationError, ForbiddenError,
} = require('apollo-server-lambda');
const dbPolls = require('../data/polls');

const typeDefs = gql`
    type PollChoice {
        order: Int!
        value: String!
        acceptable: Boolean!
    }
    type Poll {
        userId: ID!
        createTimestamp: ID!
        question: String!
        choices: [PollChoice]!
        sharedWith: [ID]
        expireTimestamp: Int!
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
        polls(userId: ID): [Poll]
        poll(createTimestamp: ID!): Poll
    }
    type Mutation {
        createPoll(input: PollInput): Poll
    }
`;

const withPollAuthorization = (resolver) => {
  const authResolver = async (source, args, { userId }, state) => {
    const poll = await resolver(source, args, userId, state);

    if (poll && poll.userId !== userId
      && poll.sharedWith && !poll.sharedWith.includes(userId)) {
      throw new ForbiddenError('Unauthorized');
    }

    return poll;
  };
  return authResolver;
};

const pollsResolver = async (_, args, { userId }) => {
  const idToQuery = args.userId || userId;
  return dbPolls.getAll(idToQuery, idToQuery !== userId);
};

const pollResolver = async (_, { createTimestamp }, { userId }) => {
  await dbPolls.get(userId, createTimestamp);
};

const resolvers = {
  Query: {
    polls: pollsResolver,
    poll: withPollAuthorization(pollResolver),
    // directPolls: (source, args, context, state) => data.polls,
    // feed: (source, args, context, state) => data.polls,
  },
  Mutation: {
    createPoll: async (_, { input }, { userId }) => {
      // Validate input that graphQL doesn't already automatically handle
      if (input.choices.length < 2 || input.choices.length > 6) {
        throw new ValidationError('Two or more choices required - not to exceed six');
      }
      if (input.sharedWith && input.sharedWith.length > 25) {
        throw new ValidationError('Cannot share with more than 25 users');
      }
      return dbPolls.add({ ...input, userId });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (options) => ({
    ...options,
    userId: options.event.requestContext.authorizer.claims.sub,
  }),
});

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
