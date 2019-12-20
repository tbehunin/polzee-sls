import GraphQLBigInt from 'apollo-type-bigint';
import Query from './query';
import Mutation from './mutation';
import pollTypeResolver from './pollTypeResolver';

export default {
  GraphQLBigInt: new GraphQLBigInt('safe'),
  Query,
  Mutation,
  Poll: pollTypeResolver,
};
