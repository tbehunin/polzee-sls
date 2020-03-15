import pollInputValidator from './pollInputValidator';
import put from '../../data/polls/put';

export default async (currentUserId, input, loaders) => {
  // Validate the input
  const validator = pollInputValidator(currentUserId, loaders);
  validator.validate(input);

  // Create a new poll
  const draftPoll = await (input.draftPollId ? loaders.draftPoll.load(input.draftPollId) : null);
  const pollInput = {
    ...(draftPoll || {}),
    userId: currentUserId,
    ...input,
  };
  return put.poll(pollInput);
};
