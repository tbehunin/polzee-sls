const { gql } = require('apollo-server-lambda');

module.exports = gql`
    type PollChoice {
        order: Int!
        value: String!
        acceptable: Boolean!
    }
    type Poll {
        pollId: ID!
        userId: ID!
        createTimestamp: ID!
        question: String!
        choices: [PollChoice]!
        sharedWith: [ID]
        expireTimestamp: Int!
    }
    input PollChoiceInput {
        value: String!
        acceptable: Boolean!
    }
    input PollInput {
        question: String!
        choices: [PollChoiceInput!]!
        sharedWith: [ID!]
        expireTimestamp: Int!
    }
    type Query {
        polls(userId: ID): [Poll]
        poll(userId: ID, createTimestamp: ID!): Poll
        directPolls: [Poll]
    }
    type Mutation {
        createPoll(input: PollInput): Poll
    }
`;
