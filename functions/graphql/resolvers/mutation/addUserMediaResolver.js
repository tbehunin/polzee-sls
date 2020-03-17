
import { UserInputError, ApolloError, ForbiddenError } from 'apollo-server-lambda';
import mediaService from '../../../../services/mediaService';
import query from '../../../../data/polls/query';

export default async (_, { mediaUploadId, contentType }, { currentUserId }) => {
  // Validate draftPoll exists
  const draftPollList = await query.draftPoll(currentUserId, mediaUploadId);
  if (!draftPollList || draftPollList.length !== 1) {
    throw new UserInputError(`Draft poll not found by mediaUploadId ${mediaUploadId}`);
  }

  // Validate it belongs to the current user
  if (draftPollList[0].userId !== currentUserId) {
    throw new ForbiddenError('Not authorized to retrieve draftPollId');
  }

  // Validate the contentType
  const supported = ['image/bmp', 'image/gif', 'image/jpg', 'image/jpeg', 'image/png', 'video/mp4'];
  if (!supported.includes(contentType.toLowerCase())) {
    throw new UserInputError(`ContentType '${contentType}' not supported`);
  }

  let result;
  try {
    result = await mediaService.addUserMedia(mediaUploadId, currentUserId, contentType);
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error adding custom media for user ${currentUserId}`);
  }
  return result;
};
