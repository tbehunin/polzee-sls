import publishPollService from './publishPollService';

export default (currentUserId, loaders) => ({
  publishPoll: async (pollInput) => publishPollService(
    currentUserId, pollInput, loaders,
  ),
});
