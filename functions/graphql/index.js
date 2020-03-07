import { ApolloServer } from 'apollo-server-lambda';
import schema from './schema';
import resolvers from './resolvers';
import loaders from './dataLoaders';

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: (options) => ({
    ...options,
    currentUserId: options.event.requestContext.authorizer.claims.sub,
    loaders,
  }),
  formatError: (error) => {
    console.error(error);
    return error;
  },
  debug: process.env.stage !== 'prod',
});

// eslint-disable-next-line import/prefer-default-export
export const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
