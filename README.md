# s3-file-upload-api

A simple Serverless app for demonstrating an API Gateway HTTP endpoint for POSTing files to S3.

## Overview

Creates an API Gateway endpoint with binary request body support, handled by a Lambda written in Node.js, drops the file in an S3 bucket. All resources are created by CloudFormation.

## Example Request

```
POST /stage/file HTTP/1.1
Content-Type: image/png
Host: XXXXXXXXXX.execute-api.us-east-1.amazonaws.com
Content-Length: 348461

PNG
<BINARY PNG DATA>
```

## Deploy

  serverless deploy

## Logs

In CloudWatch Logs

---

## TODO

* Add CloudFormation resource for creating an IAM user with permission to invoke the API Gatway endpoint when secured with AWS_IAM authentication. Until supported, this must be done manually via the AWS Console. With AWS_IAM authentication enabled, the requester must sign the request with AWS Signature V4 like so:

```
import aws4 from 'aws4';
import axios from 'axios';

const signedRequest = aws4.sign({
  host: 'XXXXXXXXXX.execute-api.us-east-1.amazonaws.com',
  url: `XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/stage/file`,
  path: '/stage/file',
  method: 'POST',
  data: file, // buffer
  body: file, // buffer
  headers: {
    'Content-Type': fileContentType,
    'Content-Length': fileContentLength,
  },
}, {
  accessKeyId: '<aws access key id>',
  secretAccessKey: '<aws secret access key>',
  region: 'us-east-1',
});

delete signedRequest.headers.Host;
delete signedRequest.headers['Content-Length'];

const resp = await axios(signedRequest);
```
