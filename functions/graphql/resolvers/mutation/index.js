import vote from './voteResolver';
import toggleFollow from './toggleFollowResolver';
import comment from './commentResolver';
import toggleLike from './toggleLikeResolver';
import addCustomMedia from './addCustomMediaResolver';
import pollService from '../../../../services/pollService';

export default {
  saveDraft: async (_, { input }, { currentUserId, loaders }) => {
    const svc = pollService(currentUserId, loaders);
    return svc.saveDraft(input);
  },
  publishPoll: async (_, { input }, { currentUserId, loaders }) => {
    const svc = pollService(currentUserId, loaders);
    return svc.publishPoll(input);
  },
  vote,
  toggleFollow,
  comment,
  toggleLike,
  addCustomMedia,
};
