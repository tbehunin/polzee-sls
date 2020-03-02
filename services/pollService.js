import put from '../data/polls/put';

export default {
  saveDraft: async (data) => put.draftPoll(data),
};
