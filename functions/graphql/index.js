import { ApolloServer } from 'apollo-server-lambda';
import schema from './schema';
import resolvers from './resolvers';

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: (options) => ({
    ...options,
    currentUserId: options.event.requestContext.authorizer.claims.sub,
  }),
});

// eslint-disable-next-line import/prefer-default-export
export const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
