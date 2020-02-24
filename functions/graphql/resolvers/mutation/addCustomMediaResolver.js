
import { ValidationError, ApolloError, ForbiddenError } from 'apollo-server-lambda';
import mediaService from '../../../../services/mediaService';

export default async (_, { draftPollId, contentType }, { currentUserId, loaders }) => {
  // Validate draftPoll exists
  const draftPoll = await loaders.draftPoll.load(draftPollId);
  if (!draftPoll) {
    throw new ValidationError(`DraftPollId '${draftPollId}' not found`);
  }

  // Validate it belongs to the current user
  if (draftPoll.userId !== currentUserId) {
    throw new ForbiddenError(`Not authorized to retrieve draftPollId '${draftPollId}'`);
  }

  // Validate the contentType
  const supported = ['image/bmp', 'image/gif', 'image/jpg', 'image/jpeg', 'image/png', 'video/mp4'];
  if (!supported.includes(contentType.toLowerCase())) {
    throw new ValidationError(`ContentType '${contentType}' not supported`);
  }

  let result;
  try {
    result = await mediaService.addCustomMedia(draftPollId, currentUserId, contentType);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error adding custom media for user ${currentUserId}`);
  }
  return result;
};
