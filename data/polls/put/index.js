import { Base64 } from 'js-base64';
import { v4 as uuidv4 } from 'uuid';
import data from '../..';

const put = async (params) => {
  const pollParams = {
    Item: { ...params },
    TableName: process.env.dbPolls,
  };
  return data.db.put(pollParams).promise();
};

const batch = async (items) => {
  const params = {
    RequestItems: {
      [process.env.dbPolls]: items.map((item) => ({
        PutRequest: {
          Item: item,
        },
      })),
    },
  };
  return data.db.batchWrite(params).promise();
};

export default {
  vote: async (userId, pollId, selection) => {
    const timestamp = Date.now();
    const vote = {
      hashKey: `UserId:${userId}`,
      sortKey: `Vote:${pollId}`,
      hashData1: `PollId:${pollId}`,
      sortData1: `Vote:${timestamp}:${userId}`,
      userId,
      pollId,
      selection,
      timestamp,
    };
    await put(vote);
    return vote;
  },
  comment: async (userId, pollId, comment) => {
    const timestamp = Date.now();
    const commentItem = {
      hashKey: `UserId:${userId}`,
      sortKey: `Comment:${pollId}:${timestamp}`,
      hashData1: `PollId:${pollId}`,
      sortData1: `Comment:${timestamp}:${userId}`,
      userId,
      pollId,
      comment,
      createTimestamp: timestamp,
    };
    await put(commentItem);
    return commentItem;
  },
  like: async (userId, pollId) => {
    const timestamp = Date.now();
    const like = {
      hashKey: `UserId:${userId}`,
      sortKey: `Like:${pollId}`,
      hashData1: `PollId:${pollId}`,
      sortData1: `Like:${timestamp}:${userId}`,
      userId,
      pollId,
      timestamp,
    };
    await put(like);
    return like;
  },
  follow: async (followerUserId, followingUserId, status = 'Accepted') => {
    const timestamp = Date.now();
    const follow = {
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
    };
    await put(follow);
    return follow;
  },
  media: async (userId, mediaUploadId, mediaId, contentType) => {
    const createTimestamp = Date.now();
    const media = {
      hashKey: `UserId:${userId}`,
      sortKey: `Media:${mediaUploadId}:${mediaId}`,
      userId,
      mediaUploadId,
      mediaId,
      contentType,
      createTimestamp,
      uploaded: false,
    };
    await put(media);
    return media;
  },
  draftPoll: async ({
    draftPollId,
    userId,
    question,
    choices,
    sharedWith,
    expireTimeUnit,
    expireTimeValue,
    mediaUploadId,
    background,
    reaction,
    reactionApproved,
  }) => {
    const timestamp = Date.now();
    let draftPollIdToUse;
    let userIdToUse;
    let createTimestampToUse;

    if (draftPollId) {
      draftPollIdToUse = draftPollId;
      const draftPollIdSplit = Base64.decode(draftPollId).split(':');
      if (draftPollIdSplit.length !== 2) {
        throw new Error(`Unknown format for draftPollId '${draftPollId}'`);
      }
      [userIdToUse, createTimestampToUse] = draftPollIdSplit;
    } else {
      if (!userId) {
        throw new Error('Missing userId');
      }
      draftPollIdToUse = Base64.encode(`${userId}:${timestamp}`);
      userIdToUse = userId;
      createTimestampToUse = timestamp;
    }

    const mediaUploadIdToUse = mediaUploadId || uuidv4();
    const params = {
      hashKey: `UserId:${userId}`,
      sortKey: `DraftPoll:${createTimestampToUse}`,
      sortData1: `DraftPollMediaUpload:${mediaUploadIdToUse}`,
      draftPollId: draftPollIdToUse,
      userId: userIdToUse,
      question,
      choices,
      sharedWith,
      expireTimeUnit,
      expireTimeValue,
      mediaUploadId: mediaUploadIdToUse,
      background,
      reaction,
      reactionApproved,
      createTimestamp: createTimestampToUse,
      updateTimestamp: timestamp,
    };
    await put(params);
    return params;
  },
  poll: async ({
    userId,
    question,
    choices,
    sharedWith,
    expireTimeUnit,
    expireTimeValue,
    mediaUploadId,
    background,
    reaction,
    reactionApproved,
  }) => {
    const timestamp = Date.now();
    const pollId = Base64.encode(`${userId}:${timestamp}`);
    const scope = (sharedWith || []).length ? 'Private' : 'Public';
    const timeUnitMs = {
      MINUTES: 60000,
      HOURS: 3600000,
      DAYS: 86400000,
    };

    let expireTimestamp;
    if (expireTimeUnit && expireTimeValue > 0) {
      expireTimestamp = timestamp + (timeUnitMs[expireTimeUnit] * expireTimeValue);
    }

    const newPoll = {
      hashKey: `UserId:${userId}`,
      sortKey: `Poll:${timestamp}`,
      sortData1: `${scope}:${timestamp}`,
      pollId,
      userId,
      question,
      choices: choices.map((choice, idx) => ({
        ...choice,
        order: idx + 1,
      })),
      sharedWith,
      expireTimestamp,
      mediaUploadId: mediaUploadId || uuidv4(),
      background,
      reaction,
      reactionApproved,
      createTimestamp: timestamp,
    };
    const items = [newPoll].concat((sharedWith || []).map((otherUserId) => ({
      PutRequest: {
        Item: {
          hashKey: `UserId:${otherUserId}`,
          sortKey: `DirectPoll:${pollId}`,
          sortData1: `DirectPoll:${timestamp}:${pollId}`,
          userId: otherUserId,
          pollId,
          timestamp,
        },
      },
    })));
    await batch(items);
    return newPoll;
  },
};
