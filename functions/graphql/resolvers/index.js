const GraphQLBigInt = require('apollo-type-bigint').default;
const Query = require('./query');
const Mutation = require('./mutation');

module.exports = { GraphQLBigInt: new GraphQLBigInt('safe'), Query, Mutation };
