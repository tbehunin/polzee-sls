import GraphQLBigInt from 'apollo-type-bigint';
import Query from './query';
import Mutation from './mutation';
import pollTypeResolver from './types/pollTypeResolver';
import pollChoiceTypeResolver from './types/pollChoiceTypeResolver';
import userTypeResolver from './types/userTypeResolver';

export default {
  GraphQLBigInt: new GraphQLBigInt('safe'),
  Query,
  Mutation,
  Poll: pollTypeResolver,
  PollChoice: pollChoiceTypeResolver,
  User: userTypeResolver,
};
