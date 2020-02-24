const basicPropResolvers = ['draftPollId', 'timestamp']
  .reduce((acc, prop) => {
    acc[prop] = async ({ draftPollId }, _, { loaders }) => {
      const draftPoll = await loaders.draftPoll.load(draftPollId);
      return draftPoll[prop];
    };
    return acc;
  }, {});

export default {
  ...basicPropResolvers,
  user: async ({ userId }) => ({ userId }),
};
