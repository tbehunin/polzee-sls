const withPollAuthorization = (resolver) => {
  const authResolver = async (source, args, context, state) => {
    const data = await resolver(source, args, context, state);

    if (data && data.userId !== context.userId
      && data.sharedWith && data.sharedWith.length > 0
      && !data.sharedWith.includes(context.userId)) {
      throw new ForbiddenError('Unauthorized');
    }

    return data;
  };
  return authResolver;
};

module.exports = withPollAuthorization;
