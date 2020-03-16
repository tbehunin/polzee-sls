import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import put from '../data/polls/put';

export default {
  addUserMedia: async (draftPollId, userId, contentType) => {
    const mediaId = uuidv4();
    const expires = 300; // five minutes
    const s3 = new AWS.S3();
    const params = {
      Bucket: process.env.s3PollsBucket,
      Key: `${userId}/${mediaId}`,
      ContentType: contentType,
      Expires: expires,
    };
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

    const media = await put.media(userId, draftPollId, mediaId, contentType);
    return { ...media, uploadUrl };
  },
};
