import saveDraftService from './saveDraftService';
import publishPollService from './publishPollService';

export default (currentUserId, loaders) => ({
  saveDraft: async (pollInput) => saveDraftService(
    currentUserId, pollInput, loaders,
  ),
  publishPoll: async (pollInput) => publishPollService(
    currentUserId, pollInput, loaders,
  ),
});
