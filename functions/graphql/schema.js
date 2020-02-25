import { gql } from 'apollo-server-lambda';

export default gql`
    scalar GraphQLBigInt

    type addCustomMediaResponse {
        mediaId: ID!
        uploadUrl: String!
    }
    type Comment {
        user: User!
        comment: String!
        createTimestamp: GraphQLBigInt!
    }
    type Like {
        user: User!
        timestamp: GraphQLBigInt!
    }
    type Vote {
        user: User!
        timestamp: GraphQLBigInt!
    }
    type DraftPoll {
        draftPollId: ID!
        user: User!
        timestamp: GraphQLBigInt!
    }
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
        bio: String!
        private: Boolean!
        followers: [User]
        following: [User]
    }
    type Poll {
        pollId: ID!
        user: User!
        createTimestamp: GraphQLBigInt!
        question: String!
        choices: [PollChoice]!
        sharedWith: [ID]
        expireTimestamp: GraphQLBigInt!
        comments: [Comment]!
        likes: [Like]!
        votes: [Vote]!
    }
    input MediaItemInput {
        mediaId: ID!
        type: MediaType!
    }
    input PollChoiceInput {
        value: String!
        acceptable: Boolean!
        media: MediaItemInput
    }
    input PollInput {
        draftPollId: ID!
        question: String!
        choices: [PollChoiceInput!]!
        sharedWith: [ID!]
        expireTimestamp: GraphQLBigInt!
        background: MediaItemInput
        reaction: MediaItemInput
        reactionApproved: MediaItemInput
    }
    input VoteInput {
        pollId: ID!
        selection: [Int]!
    }
    type Query {
        polls(userId: ID): [Poll]
        poll(pollId: ID!): Poll
        directPolls: [Poll]
        user(userId: ID!): User
    }
    type Mutation {
        draftPoll: DraftPoll
        createPoll(input: PollInput): Poll
        vote(input: VoteInput!): Poll
        toggleFollow(userId: ID!): User
        comment(pollId: ID!, comment: String!): Poll
        toggleLike(pollId: ID!): Poll
        addCustomMedia(draftPollId: ID!, contentType: String!): addCustomMediaResponse
    }
`;
