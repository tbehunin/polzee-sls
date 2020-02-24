import { Base64 } from 'js-base64';
import data from '../..';

const batchGet = async (keys) => {
  const pollParams = {
    RequestItems: {
      [process.env.dbPolls]: {
        Keys: keys,
      },
    },
  };
  const result = await data.db.batchGet(pollParams).promise();
  console.log('batchGet keys', keys, 'result', result);
  return ((result || {}).Responses || {})[process.env.dbPolls] || [];
};

export default {
  polls: async (pollIds) => {
    const keys = pollIds.map((pollId) => {
      const pollIdSplit = Base64.decode(pollId).split(':');
      return {
        hashKey: `UserId:${pollIdSplit[0]}`,
        sortKey: `Poll:${pollIdSplit[1]}`,
      };
    });
    return batchGet(keys);
  },
  votes: async (voteKeys) => {
    const keys = voteKeys.map((voteKey) => ({
      hashKey: `UserId:${voteKey.userId}`,
      sortKey: `Vote:${voteKey.pollId}`,
    }));
    return batchGet(keys);
  },
  users: async (userIds) => {
    const keys = userIds.map((userId) => ({
      hashKey: `UserId:${userId}`,
      sortKey: 'Profile',
    }));
    return batchGet(keys);
  },
  draftPolls: async (draftPollIds) => {
    const keys = draftPollIds.map((draftPollId) => {
      const draftPollIdSplit = Base64.decode(draftPollId).split(':');
      return {
        hashKey: `UserId:${draftPollIdSplit[0]}`,
        sortKey: `DraftPoll:${draftPollIdSplit[1]}`,
      };
    });
    return batchGet(keys);
  },
};
