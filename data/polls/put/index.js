import { Base64 } from 'js-base64';
import data from '../..';

const put = async (params) => {
  const pollParams = {
    ...params,
    TableName: process.env.dbPolls,
  };
  return data.db.put(pollParams).promise();
};

export default {
  vote: async (userId, pollId, selection) => {
    const timestamp = Date.now();
    const params = {
      Item: {
        hashKey: `UserId:${userId}`,
        sortKey: `Vote:${pollId}`,
        hashData1: `PollId:${pollId}`,
        sortData1: `Vote:${timestamp}:${userId}`,
        userId,
        pollId,
        selection,
        timestamp,
      },
    };
    await put(params);
    return params.Item;
  },
  comment: async (userId, pollId, comment) => {
    const timestamp = Date.now();
    const params = {
      Item: {
        hashKey: `UserId:${userId}`,
        sortKey: `Comment:${pollId}:${timestamp}`,
        hashData1: `PollId:${pollId}`,
        sortData1: `Comment:${timestamp}:${userId}`,
        userId,
        pollId,
        comment,
        createTimestamp: timestamp,
      },
    };
    await put(params);
    return params.Item;
  },
  like: async (userId, pollId) => {
    const timestamp = Date.now();
    const params = {
      Item: {
        hashKey: `UserId:${userId}`,
        sortKey: `Like:${pollId}`,
        hashData1: `PollId:${pollId}`,
        sortData1: `Like:${timestamp}:${userId}`,
        userId,
        pollId,
        timestamp,
      },
    };
    await put(params);
    return params.Item;
  },
  follow: async (followerUserId, followingUserId, status = 'Accepted') => {
    const timestamp = Date.now();
    const params = {
      Item: {
        hashKey: `UserId:${followerUserId}`,
        sortKey: `Follow:${followingUserId}`,
        hashData1: `UserId:${followingUserId}`,
        sortData1: `Following:${timestamp}:${followingUserId}`,
        sortData2: `Follower:${timestamp}:${followerUserId}`,
        sortData3: `Follower:${status}:${timestamp}:${followerUserId}`,
        followerUserId,
        followingUserId,
        status,
        timestamp,
      },
    };
    await put(params);
    return params.Item;
  },
  media: async (userId, draftPollId, mediaId, contentType) => {
    const timestamp = Date.now();
    const params = {
      Item: {
        hashKey: `UserId:${userId}`,
        sortKey: `Media:${draftPollId}:${mediaId}`,
        mediaId,
        contentType,
        timestamp,
      },
    };
    await put(params);
    return params.Item;
  },
  draftPoll: async (userId) => {
    const timestamp = Date.now();
    const draftPollId = Base64.encode(`${userId}:${timestamp}`);
    const params = {
      Item: {
        hashKey: `UserId:${userId}`,
        sortKey: `DraftPoll:${timestamp}`,
        userId,
        draftPollId,
        timestamp,
      },
    };
    await put(params);
    return params.Item;
  },
};
