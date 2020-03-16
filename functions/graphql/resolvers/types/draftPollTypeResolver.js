import services from '../../../../services';

const options = {
  itemType: 'DraftPoll',
  throwWhenNotFound: true,
  authorizerFn: (draftPoll, currentUserId) => draftPoll.userId === currentUserId,
};

const basicPropResolvers = ['draftPollId', 'question', 'sharedWith', 'expireTimeUnit',
  'expireTimeValue', 'createTimestamp', 'updateTimestamp', 'mediaUploadId']
  .reduce((acc, prop) => {
    acc[prop] = async ({ draftPollId }, _, { currentUserId, loaders }) => {
      const svc = services(currentUserId, loaders.draftPoll);
      const draftPoll = await svc.getItemByKey(draftPollId, options);
      return draftPoll[prop];
    };
    return acc;
  }, {});

export default {
  ...basicPropResolvers,
  choices: async ({ draftPollId }, _, { currentUserId, loaders }) => {
    // Some choice props need info from the draft poll in order to validate and resolve properly
    // so send the draft poll data along with EACH choice.
    const svc = services(currentUserId, loaders.draftPoll);
    const draftPoll = await svc.getItemByKey(draftPollId, options);
    return (draftPoll.choices || []).map((choice) => ({ draftPoll, ...choice }));
  },
  user: async ({ draftPollId }, _, { currentUserId, loaders }) => {
    const svc = services(currentUserId, loaders.draftPoll);
    const draftPoll = await svc.getItemByKey(draftPollId, options);
    return { userId: draftPoll.userId };
  },
};
