import { ValidationError, ForbiddenError } from 'apollo-server-lambda';

export default async (_, { input }, { currentUserId, loaders }) => {
  // Validate input that graphQL doesn't already automatically handle
  if (input.choices.length < 2 || input.choices.length > 6) {
    throw new ValidationError('Two or more choices required - not to exceed six');
  }
  if (input.sharedWith && input.sharedWith.length) {
    if (input.sharedWith.length > 25) {
      throw new ValidationError('Cannot share with more than 25 users');
    }

    const users = await loaders.user.loadMany(input.sharedWith);
    const invalidUsers = users.filter((user) => !user);
    if (invalidUsers.length) {
      throw new ValidationError(`Users not found: ${invalidUsers.join(', ')}`);
    }
  }

  let draftPoll;
  if (input.draftPollId) {
    // Validate draftPoll exists
    draftPoll = await loaders.draftPoll.load(input.draftPollId);

    if (!draftPoll) {
      throw new ValidationError(`DraftPollId '${input.draftPollId}' not found`);
    }

    // Validate it belongs to the current user
    if (draftPoll.userId !== currentUserId) {
      throw new ForbiddenError(`Not authorized to retrieve draftPollId '${input.draftPollId}'`);
    }
  }

  // Validate expiration occurs in the future
  if (input.expireTimestamp <= Date.now()) {
    throw new ValidationError(`Expiration timestamp '${input.expireTimestamp}' must occur in the future`);
  }

  const mediaItems = [input.background, input.reaction, input.reactionApproved].concat(
    input.choices.map((choice) => choice.media).filter(
      (mediaInput) => mediaInput && mediaInput.mediaUploadId,
    ),
  );

  // Validate user mediaId's
  const userMediaItems = mediaItems.filter((mediaInput) => mediaInput.type === 'USER');
  if (userMediaItems.length) {
    if (!draftPoll || !draftPoll.mediaUploadId) {
      throw new ValidationError('Missing draftPollId and/or mediaUploadId');
    }

    const userMediaItemKeys = userMediaItems.map((mediaInput) => ({
      userId: currentUserId,
      mediaUploadId: draftPoll.mediaUploadId,
      mediaId: mediaInput.mediaId,
    }));

    const mediaList = await loaders.userMedia.loadMany(userMediaItemKeys);
    const invalidMedia = mediaList.filter((media) => !media || !media.uploaded);
    if (invalidMedia.length) {
      throw new ValidationError(`User media not uploaded or not found: ${invalidMedia.join(', ')}`);
    }
  }

  // Validate global mediaId's
  const globalMediaItems = mediaItems.filter((mediaInput) => mediaInput.type === 'GLOBAL');
  if (globalMediaItems.length) {
    const globalMediaItemKeys = globalMediaItems.map((mediaInput) => mediaInput.mediaId);

    const mediaList = await loaders.globalMedia.loadMany(globalMediaItemKeys);
    const invalidMedia = mediaList.filter((media) => !media);
    if (invalidMedia.length) {
      throw new ValidationError(`Global media not found: ${invalidMedia.join(', ')}`);
    }
  }
};
