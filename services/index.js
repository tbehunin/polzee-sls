import { ForbiddenError, UserInputError } from 'apollo-server-lambda';

export default (currentUserId, loader) => ({
  getItemByKey: async (key, { itemType = 'Item', throwWhenNotFound, authorizerFn }) => {
    const item = await loader.load(key);
    if (!item && throwWhenNotFound) {
      throw new UserInputError(`${itemType} with key ${key} not found`);
    }

    if (item && authorizerFn && !authorizerFn(item, currentUserId)) {
      throw new ForbiddenError('Unauthorized');
    }

    return item;
  },
});
