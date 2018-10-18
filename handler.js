import assert from 'assert';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const {
  S3_BUCKET_NAME,
} = process.env;

export const handler = async (event) => {
  const contentType = event.headers['Content-Type'] || event.headers['content-type'];
  const contentLength = event.headers['Content-Length'] || event.headers['content-length'];

  assert(contentType === 'image/png' || contentType === 'image/jpeg' || contentType === 'image/jpg');

  // TODO: support more files
  const ext = contentType.endsWith('png') ? '.png' : '.jpg';

  // API Gateway sends the file as a Base64-encoded binary string
  const image = Buffer.from(event.body, 'base64');
  const s3Resp = await s3.upload({
    Bucket: S3_BUCKET_NAME,
    Body: image,
    Key: `inbox/${event.requestContext.requestId}${ext}`,
    ContentType: contentType,
    ContentLength: contentLength,
  }).promise();

  const response = {
    statusCode: 200,
    body: JSON.stringify(s3Resp),
  };

  return response;
};
