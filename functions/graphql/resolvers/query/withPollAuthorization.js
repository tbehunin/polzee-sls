import { ForbiddenError } from 'apollo-server-lambda';

const withPollAuthorization = (resolver) => {
  const authResolver = async (source, args, context, state) => {
    const data = await resolver(source, args, context, state);

    if (data && data.userId !== context.currentUserId
      && data.sharedWith && data.sharedWith.length > 0
      && !data.sharedWith.includes(context.currentUserId)) {
      throw new ForbiddenError('Unauthorized');
    }

    return data;
  };
  return authResolver;
};

export default withPollAuthorization;
