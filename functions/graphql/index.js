const { ApolloServer } = require('apollo-server-lambda');
const schema = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs: schema,
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
