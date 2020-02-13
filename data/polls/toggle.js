import get from './get';
import put from './put';
import del from './delete';

export default {
  follow: async (followerUserId, followingUserId) => {
    // Check to see if follow exists
    const follow = await get.follow(followerUserId, followingUserId);

    const operation = follow ? del.follow : put.follow;
    return operation(followerUserId, followingUserId);
  },
  like: async (userId, pollId) => {
    // Check to see if poll has already been liked
    const liked = await get.like(userId, pollId);

    const operation = liked ? del.like : put.like;
    return operation(userId, pollId);
  },
};
