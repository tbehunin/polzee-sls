const basicPropResolvers = ['value', 'acceptable']
  .reduce((acc, prop) => {
    acc[prop] = async ({ draftPoll, ...choice }) => choice[prop];
    return acc;
  }, {});

export default {
  ...basicPropResolvers,
  media: async () => ({ type: 'USER', contentType: 'foo', url: 'http://foo.bar' }),
};
