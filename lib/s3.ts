import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  ...(process.env.S3_ENDPOINT && {
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true, // Required for MinIO
  }),
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

export async function getPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;
}

export async function uploadToS3(file: Buffer, key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Return only the key (filename)
  return key;
}

export async function getFromS3(key: string): Promise<{ buffer: Buffer; contentType: string }> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);

  if (!response.Body) {
    throw new Error('No body in S3 response');
  }

  const byteArray = await response.Body.transformToByteArray();
  const buffer = Buffer.from(byteArray);
  const contentType = response.ContentType || 'application/octet-stream';

  return { buffer, contentType };
}

export async function deleteFromS3(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

export function getKeyFromUrl(url: string): string | null {
  if (process.env.S3_ENDPOINT) {
    // MinIO path-style URL
    const minioUrl = `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/`;
    if (url.startsWith(minioUrl)) {
      return url.replace(minioUrl, '');
    }
  }
  const bucketUrl = `https://${BUCKET_NAME}.s3.${process.env.S3_REGION || 'ap-southeast-1'}.amazonaws.com/`;
  if (url.startsWith(bucketUrl)) {
    return url.replace(bucketUrl, '');
  }
  return null;
}

export { BUCKET_NAME, s3Client };
