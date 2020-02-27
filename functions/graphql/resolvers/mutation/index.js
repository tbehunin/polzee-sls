import savePoll from './savePollResolver';
import vote from './voteResolver';
import toggleFollow from './toggleFollowResolver';
import comment from './commentResolver';
import toggleLike from './toggleLikeResolver';
import addCustomMedia from './addCustomMediaResolver';
import draftPoll from './draftPollResolver';

export default {
  draftPoll,
  savePoll,
  vote,
  toggleFollow,
  comment,
  toggleLike,
  addCustomMedia,
};
