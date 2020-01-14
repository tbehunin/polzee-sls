import DataLoader from 'dataloader';
import batchGet from '../../data/polls/batchGet';

const userLoader = new DataLoader(async (userIds) => {
  const users = await batchGet.users(userIds);
  return userIds.map((userId) => users.find((user) => user.userId === userId));
});

export default {
  user: userLoader,
};
