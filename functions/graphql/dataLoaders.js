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

export default {
  poll: pollsLoader,
  user: userLoader,
  vote: votesLoader,
};
