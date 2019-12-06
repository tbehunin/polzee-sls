const { gql } = require('apollo-server-lambda');

module.exports = gql`
    scalar GraphQLBigInt

    type PollChoice {
        order: Int!
        value: String!
        acceptable: Boolean
        selected: Boolean
    }
    type Poll {
        pollId: ID!
        userId: ID!
        createTimestamp: GraphQLBigInt!
        question: String!
        choices: [PollChoice]!
        sharedWith: [ID]
        expireTimestamp: GraphQLBigInt!
    }
    input PollChoiceInput {
        value: String!
        acceptable: Boolean!
    }
    input PollInput {
        question: String!
        choices: [PollChoiceInput!]!
        sharedWith: [ID!]
        expireTimestamp: GraphQLBigInt!
    }
    type Query {
        polls(userId: ID): [Poll]
        poll(userId: ID, createTimestamp: GraphQLBigInt!): Poll
        directPolls: [Poll]
    }
    type Mutation {
        createPoll(input: PollInput): Poll
    }
`;
