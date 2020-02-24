import AWS from 'aws-sdk';
import uuid from 'uuid/v1';
import put from '../data/polls/put';

export default {
  addCustomMedia: async (draftPollId, userId, contentType) => {
    const mediaId = uuid();
    const expires = 300; // five minutes
    const s3 = new AWS.S3();
    const params = {
      Bucket: process.env.s3PollsBucket,
      Key: `${userId}/${mediaId}`,
      ContentType: contentType,
      Expires: expires,
    };
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

    const media = await put.media(userId, draftPollId, mediaId);
    return { ...media, uploadUrl };
  },
};
