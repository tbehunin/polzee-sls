import { ValidationError, ApolloError, ForbiddenError } from 'apollo-server-lambda';
import add from '../../../../data/polls/add';

export default async (_, { input }, { currentUserId, loaders }) => {
  // Validate input that graphQL doesn't already automatically handle
  if (input.choices.length < 2 || input.choices.length > 6) {
    throw new ValidationError('Two or more choices required - not to exceed six');
  }
  if (input.sharedWith && input.sharedWith.length > 25) {
    throw new ValidationError('Cannot share with more than 25 users');
  }

  // Validate draftPoll exists
  const draftPoll = await loaders.draftPoll.load(input.draftPollId);
  if (!draftPoll) {
    throw new ValidationError(`DraftPollId '${input.draftPollId}' not found`);
  }

  // Validate it belongs to the current user
  if (draftPoll.userId !== currentUserId) {
    throw new ForbiddenError(`Not authorized to retrieve draftPollId '${input.draftPollId}'`);
  }

  // Validate all the custom media exists
  const mediaKeys = [input.background, input.reaction, input.reactionApproved].concat(
    input.choices.map((choice) => choice.media),
  )
    .filter((mediaInput) => mediaInput && mediaInput.type === 'CUSTOM')
    .map((mediaInput) => ({ draftPollId: input.draftPollId, mediaId: mediaInput.mediaId }));

  const mediaList = await loaders.media.loadMany(mediaKeys);
  if (mediaList.some((media) => !media || !media.uploaded)) {
    throw new ValidationError('Not all media has been uploaded yet');
  }

  let result;
  try {
    result = await add({ ...input, userId: currentUserId });
  } catch (error) {
    console.error(error);
    throw new ApolloError(`Error creating poll for user ${currentUserId}`);
  }
  return result;
};
