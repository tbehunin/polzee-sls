import saveDraft from './saveDraftResolver';
import vote from './voteResolver';
import toggleFollow from './toggleFollowResolver';
import comment from './commentResolver';
import toggleLike from './toggleLikeResolver';
import addCustomMedia from './addCustomMediaResolver';

import saveDraftValidator from './saveDraftValidator';

const withValidation = async (validator, resolver) => {
  const wrapper = async (source, args, context, state) => {
    await validator(source, args, context, state);
    return resolver(source, args, context, state);
  };
  return wrapper;
};

export default {
  saveDraft: withValidation(saveDraftValidator, saveDraft),
  vote,
  toggleFollow,
  comment,
  toggleLike,
  addCustomMedia,
};
