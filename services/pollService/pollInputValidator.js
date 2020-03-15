import { UserInputError, ForbiddenError } from 'apollo-server-lambda';

export default (currentUserId, loaders) => ({
  validate: async (input) => {
    // Validate input that graphQL doesn't already automatically handle
    if (input.choices.length < 2 || input.choices.length > 6) {
      throw new UserInputError('Two or more choices required - not to exceed six');
    }
    if (input.sharedWith && input.sharedWith.length) {
      if (input.sharedWith.length > 25) {
        throw new UserInputError('Cannot share with more than 25 users');
      }

      const users = await loaders.user.loadMany(input.sharedWith);
      const invalidUsers = input.sharedWith.reduce((acc, id, idx) => {
        if (!users[idx]) {
          acc.push(input.sharedWith[idx]);
        }
        return acc;
      }, []);
      if (invalidUsers.length) {
        throw new UserInputError(`Users not found: ${invalidUsers.join(', ')}`);
      }
    }

    let draftPoll;
    if (input.draftPollId) {
      // Validate draftPoll exists
      draftPoll = await loaders.draftPoll.load(input.draftPollId);

      if (!draftPoll) {
        throw new UserInputError(`DraftPollId '${input.draftPollId}' not found`);
      }

      // Validate it belongs to the current user
      if (draftPoll.userId !== currentUserId) {
        throw new ForbiddenError(`Not authorized to retrieve draftPollId '${input.draftPollId}'`);
      }
    }

    // Validate expiration occurs in the future
    if (input.expireTimeUnit && (!input.expireTimeValue || input.expireTimeValue < 1)) {
      throw new UserInputError(`Invalid expireTimeValue (${input.expireTimeValue}) specified for ${input.expireTimeUnit} time unit`);
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
        throw new UserInputError('Missing draftPollId and/or mediaUploadId');
      }

      const userMediaItemKeys = userMediaItems.map((mediaInput) => ({
        userId: currentUserId,
        mediaUploadId: draftPoll.mediaUploadId,
        mediaId: mediaInput.mediaId,
      }));

      const mediaList = await loaders.userMedia.loadMany(userMediaItemKeys);
      const invalidMedia = mediaList.filter((media) => !media || !media.uploaded);
      if (invalidMedia.length) {
        throw new UserInputError(`User media not uploaded or not found: ${invalidMedia.join(', ')}`);
      }
    }

    // Validate global mediaId's
    const globalMediaItems = mediaItems.filter((mediaInput) => mediaInput.type === 'GLOBAL');
    if (globalMediaItems.length) {
      const globalMediaItemKeys = globalMediaItems.map((mediaInput) => mediaInput.mediaId);

      const mediaList = await loaders.globalMedia.loadMany(globalMediaItemKeys);
      const invalidMedia = mediaList.filter((media) => !media);
      if (invalidMedia.length) {
        throw new UserInputError(`Global media not found: ${invalidMedia.join(', ')}`);
      }
    }
  },
});
