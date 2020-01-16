import GraphQLBigInt from 'apollo-type-bigint';
import Query from './query';
import Mutation from './mutation';
import pollTypeResolver from './pollTypeResolver';
import pollChoiceTypeResolver from './pollChoiceTypeResolver';
import userTypeResolver from './types/userTypeResolver';

export default {
  GraphQLBigInt: new GraphQLBigInt('safe'),
  Query,
  Mutation,
  Poll: pollTypeResolver,
  PollChoice: pollChoiceTypeResolver,
  User: userTypeResolver,
};
