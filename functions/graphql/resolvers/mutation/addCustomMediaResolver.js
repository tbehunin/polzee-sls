
import { ValidationError, ApolloError } from 'apollo-server-lambda';
import mediaService from '../../../../services/mediaService';

export default async (_, { contentType }, { currentUserId }) => {
  // Validate the contentType
  const supported = ['image/bmp', 'image/gif', 'image/jpg', 'image/jpeg', 'image/png', 'video/mp4'];
  if (!supported.includes(contentType.toLowerCase())) {
    throw new ValidationError(`ContentType '${contentType}' not supported`);
  }

  let result;
  try {
    result = await mediaService.addCustomMedia(currentUserId, contentType);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error adding custom media for user ${currentUserId}`);
  }
  return result;
};
