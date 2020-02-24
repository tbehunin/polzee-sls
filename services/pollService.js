import put from '../data/polls/put';

export default {
  draftPoll: async (userId) => put.draftPoll(userId),
};
