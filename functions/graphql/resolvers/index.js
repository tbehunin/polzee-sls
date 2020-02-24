import GraphQLBigInt from 'apollo-type-bigint';
import Query from './query';
import Mutation from './mutation';
import pollTypeResolver from './types/pollTypeResolver';
import pollChoiceTypeResolver from './types/pollChoiceTypeResolver';
import userTypeResolver from './types/userTypeResolver';
import commentTypeResolver from './types/commentTypeResolver';
import likeTypeResolver from './types/likeTypeResolver';
import voteTypeResolver from './types/voteTypeResolver';
import draftPollTypeResolver from './types/draftPollTypeResolver';

export default {
  GraphQLBigInt: new GraphQLBigInt('safe'),
  Query,
  Mutation,
  Poll: pollTypeResolver,
  PollChoice: pollChoiceTypeResolver,
  User: userTypeResolver,
  Comment: commentTypeResolver,
  Like: likeTypeResolver,
  Vote: voteTypeResolver,
  DraftPoll: draftPollTypeResolver,
};
