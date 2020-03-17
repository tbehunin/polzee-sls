import { gql } from 'apollo-server-lambda';

export default gql`
    scalar GraphQLBigInt

    enum MediaType {
        USER
        GLOBAL
    }
    enum TimeUnitType {
        MINUTES
        HOURS
        DAYS
    }
    type addUserMediaResponse {
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
    type DraftPollChoiceType {
        value: String!
        acceptable: Boolean
        media: MediaItemType
    }
    type DraftPoll {
        draftPollId: ID!
        user: User!
        question: String!
        choices: [DraftPollChoiceType]!
        sharedWith: [ID]
        expireTimeUnit: TimeUnitType
        expireTimeValue: Int
        createTimestamp: GraphQLBigInt!
        updateTimestamp: GraphQLBigInt!
        mediaUploadId: ID!
        background: MediaItemType
        reaction: MediaItemType
        reactionApproved: MediaItemType
    }
    type MediaItemType {
        type: MediaType!
        contentType: String!
        url: String!
    }
    type PollChoice {
        order: Int!
        value: String!
        acceptable: Boolean
        selected: Boolean
        media: MediaItemType
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
        background: MediaItemType
        user: User!
        createTimestamp: GraphQLBigInt!
        question: String!
        choices: [PollChoice]!
        sharedWith: [ID]
        expireTimestamp: GraphQLBigInt
        comments: [Comment]!
        likes: [Like]!
        votes: [Vote]!
        reaction: MediaItemType
        reactionApproved: MediaItemType
    }
    input MediaItemInput {
        mediaId: ID!
        type: MediaType!
    }
    input PollChoiceInput {
        value: String!
        acceptable: Boolean
        media: MediaItemInput
    }
    input PollInput {
        draftPollId: ID
        question: String!
        choices: [PollChoiceInput!]!
        sharedWith: [ID!]
        expireTimeUnit: TimeUnitType
        expireTimeValue: Int
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
        saveDraft(input: PollInput): DraftPoll
        publishPoll(input: PollInput): Poll
        vote(input: VoteInput!): Poll
        toggleFollow(userId: ID!): User
        comment(pollId: ID!, comment: String!): Poll
        toggleLike(pollId: ID!): Poll
        addUserMedia(mediaUploadId: ID!, contentType: String!): addUserMediaResponse
    }
`;
