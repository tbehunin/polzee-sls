import data from '..';
import query from './query';
import get from './get';
import put from './put';
import del from './delete';

const buildDeleteRequestItem = (sortType, userId, timestamp) => ({
  DeleteRequest: {
    Key: {
      hashKey: `UserId:${userId}`,
      sortKey: `${sortType}:${timestamp}`,
    },
  },
});
const buildPutRequestItem = (sortType, userId, otherUserId, timestamp) => ({
  PutRequest: {
    Item: {
      hashKey: `UserId:${userId}`,
      sortKey: `${sortType}:${timestamp}`,
      sortData1: `FollowOtherUserId:${otherUserId}`,
      userId,
      otherUserId,
      timestamp,
    },
  },
});

export default {
  follow: async (userId, otherUserId) => {
    const now = Date.now();

    // Check to see if follow relationship exists
    const follow = await query.follower(userId, otherUserId);

    const reqs = [];
    let result;
    if (follow) {
      // Delete the follow relationship
      reqs.push(buildDeleteRequestItem('Following', userId, follow.timestamp));
      reqs.push(buildDeleteRequestItem('Follower', otherUserId, follow.timestamp));
    } else {
      // Add the follow relationship
      result = buildPutRequestItem('Following', userId, otherUserId, now);
      reqs.push(result);
      reqs.push(buildPutRequestItem('Follower', otherUserId, userId, now));
    }

    const params = {
      RequestItems: {
        [process.env.dbPolls]: reqs,
      },
    };

    await data.db.batchWrite(params).promise();
    return result;
  },
  like: async (userId, pollId) => {
    // Check to see if follow relationship exists
    const liked = await get.like(userId, pollId);

    const operation = liked ? del.like : put.like;
    return operation(userId, pollId);
  },
};
