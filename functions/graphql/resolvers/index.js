import GraphQLBigInt from 'apollo-type-bigint';
import Query from './query';
import Mutation from './mutation';

export default { GraphQLBigInt: new GraphQLBigInt('safe'), Query, Mutation };
