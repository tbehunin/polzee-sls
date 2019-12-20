import { gql } from 'apollo-server-lambda';

export default gql`
    scalar GraphQLBigInt

    type PollChoice {
        order: Int!
        value: String!
        acceptable: Boolean
        selected: Boolean
    }
    type User {
        userId: ID!
        username: String!
        fullName: String!
        email: String!
    }
    type Poll {
        pollId: ID!
        user: User!
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
    input VoteInput {
        pollId: String!
        selection: [Int]!
    }
    type Query {
        polls(userId: ID): [Poll]
        poll(pollId: ID!): Poll
        directPolls: [Poll]
    }
    type Mutation {
        createPoll(input: PollInput): Poll
        vote(input: VoteInput): Poll
    }
`;
