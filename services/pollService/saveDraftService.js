import pollInputValidator from './pollInputValidator';
import put from '../../data/polls/put';

export default async (currentUserId, input, loaders) => {
  // Validate the input
  const validator = pollInputValidator(currentUserId, loaders);
  await validator.validate(input);

  // Upsert draft poll
  return put.draftPoll({ ...input, userId: currentUserId });
};
