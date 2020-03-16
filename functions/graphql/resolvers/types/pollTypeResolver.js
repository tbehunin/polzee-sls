import services from '../../../../services';
import query from '../../../../data/polls/query';

const options = {
  itemType: 'Poll',
  throwWhenNotFound: true,
  authorizerFn: (poll, currentUserId) => (
    poll.userId === currentUserId || (poll.sharedWith || []).includes(currentUserId)
  ),
};

const basicPropResolvers = ['pollId', 'createTimestamp', 'question', 'sharedWith', 'expireTimestamp']
  .reduce((acc, prop) => {
    acc[prop] = async ({ pollId }, _, { currentUserId, loaders }) => {
      const svc = services(currentUserId, loaders.poll);
      const poll = await svc.getItemByKey(pollId, options);
      return poll[prop];
    };
    return acc;
  }, {});

const toManyPropResolvers = ['comments', 'likes', 'votes']
  .reduce((acc, prop) => {
    acc[prop] = async ({ pollId }, _, { currentUserId, loaders }) => {
      const svc = services(currentUserId, loaders.poll);
      const poll = await svc.getItemByKey(pollId, options);
      return query[prop](poll.pollId);
    };
    return acc;
  }, {});

export default {
  ...basicPropResolvers,
  ...toManyPropResolvers,
  choices: async ({ pollId }, _, { currentUserId, loaders }) => {
    // Some choice props need info from the poll in order to validate and resolve properly
    // so send the poll data along with EACH choice.
    const svc = services(currentUserId, loaders.poll);
    const poll = await svc.getItemByKey(pollId, options);
    return (poll.choices || []).map((choice) => ({ poll, ...choice }));
  },
  user: async ({ pollId }, _, { currentUserId, loaders }) => {
    const svc = services(currentUserId, loaders.poll);
    const poll = await svc.getItemByKey(pollId, options);
    return { userId: poll.userId };
  },
};
