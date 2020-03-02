import hash from 'object-hash';
import DataLoader from 'dataloader';
import batchGet from '../../data/polls/batchGet';

const pollsLoader = new DataLoader(async (pollIds) => {
  const polls = await batchGet.polls(pollIds);
  return pollIds.map((pollId) => polls.find((poll) => poll.pollId === pollId));
});

const userLoader = new DataLoader(async (userIds) => {
  const users = await batchGet.users(userIds);
  return userIds.map((userId) => users.find((user) => user.userId === userId));
});

const votesLoader = new DataLoader(async (keys) => {
  const votes = await batchGet.votes(keys);
  return keys.map((key) => votes.find(
    (vote) => vote.userId === key.userId && vote.pollId === key.pollId,
  ));
}, {
  cacheKeyFn: ({ userId, pollId }) => hash({ userId, pollId }),
});

const draftPollsLoader = new DataLoader(async (draftPollIds) => {
  const draftPolls = await batchGet.draftPolls(draftPollIds);
  return draftPollIds.map((draftPollId) => draftPolls
    .find((draftPoll) => draftPoll.draftPollId === draftPollId));
});

const userMediaLoader = new DataLoader(async (keys) => {
  const mediaItems = await batchGet.userMedia(keys);
  return keys.map((key) => mediaItems.find(
    (mediaItem) => mediaItem.userId === key.userId && mediaItem.mediaUploadId === key.mediaUploadId
      && mediaItem.mediaId === key.mediaId,
  ));
}, {
  cacheKeyFn: ({ userId, mediaUploadId, mediaId }) => hash({ userId, mediaUploadId, mediaId }),
});

const globalMediaLoader = new DataLoader(async (globalMediaIds) => {
  const globalMediaItems = await batchGet.globalMedia(globalMediaIds);
  return globalMediaIds.map((globalMediaId) => globalMediaItems
    .find((globalMediaItem) => globalMediaItem.globalMediaId === globalMediaId));
});

export default {
  poll: pollsLoader,
  user: userLoader,
  vote: votesLoader,
  draftPoll: draftPollsLoader,
  userMedia: userMediaLoader,
  globalMedia: globalMediaLoader,
};
