import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ตรวจสอบ Config พื้นฐาน
const REGION = process.env.S3_REGION || 'ap-southeast-1';
const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !BUCKET_NAME) {
  console.warn('⚠️ AWS S3 credentials or Bucket Name are missing in environment variables.');
}

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  ...(process.env.S3_ENDPOINT && {
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true, // จำเป็นสำหรับ MinIO หรือ LocalStack
  }),
});

/**
 * สร้าง URL ชั่วคราวเพื่อให้ Client (Flutter/Web) อัปโหลดไฟล์ขึ้น S3 โดยตรง
 * ช่วยลดภาระของ Server Next.js
 */
/**
 * สร้าง URL สำหรับการอัปโหลด (PUT) โดยตรงจาก Client
 * @param key - Path ของไฟล์ใน S3 (เช่น 'products/image.jpg')
 * @param contentType - ชนิดของไฟล์ (เช่น 'image/jpeg', 'image/png')
 */
/**
 * สร้าง URL สำหรับการอัปโหลด (PUT) โดยตรงจาก Client
 */
export async function getPresignedUploadUrl(key: string, contentType: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    // ใช้แค่ expiresIn ก็เพียงพอแล้วครับ
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });

    return signedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Could not generate upload URL');
  }
}

/**
 * อัปโหลดไฟล์จาก Server-side (เช่น รับไฟล์จาก Form ใน Next.js แล้วส่งต่อ)
 */
export async function uploadToS3(file: Buffer | Uint8Array, key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return key;
}

/**
 * ดึงไฟล์จาก S3
 * ปรับปรุง: ใช้ transformToByteArray เพื่อความแม่นยำใน Next.js Runtime
 */
export async function getFromS3(key: string): Promise<{ buffer: Buffer; contentType: string }> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error('S3 Response Body is empty');
    }

    // แปลง Body เป็น Buffer เพื่อส่งต่อให้ Next.js Response
    const byteArray = await response.Body.transformToByteArray();
    const buffer = Buffer.from(byteArray);
    const contentType = response.ContentType || 'application/octet-stream';

    return { buffer, contentType };
  } catch (error: any) {
    console.error(`Error getting object ${key} from S3:`, error);
    throw error;
  }
}

/**
 * ลบไฟล์ออกจาก S3
 */
export async function deleteFromS3(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * แปลง URL ของ S3 กลับมาเป็น Key (ชื่อไฟล์)
 * เพื่อเอาไว้ใช้ในฟังก์ชัน Delete หรือ Update
 */
export function getKeyFromUrl(url: string): string | null {
  if (!url) return null;

  try {
    if (process.env.S3_ENDPOINT) {
      // สำหรับ MinIO: http://localhost:9000/bucket-name/path/to/file.jpg
      const endpoint = process.env.S3_ENDPOINT.replace(/\/$/, ''); // ตัด / ท้ายออกถ้ามี
      const minioPrefix = `${endpoint}/${BUCKET_NAME}/`;
      if (url.startsWith(minioPrefix)) return url.replace(minioPrefix, '');
    }

    // สำหรับ AWS S3 มาตรฐาน: https://bucket.s3.region.amazonaws.com/path/to/file.jpg
    const amazonUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/`;
    if (url.startsWith(amazonUrl)) return url.replace(amazonUrl, '');

    // กรณีเป็น URL แบบพึ่งพาโครงสร้าง API ของเราเอง (Proxy)
    if (url.includes('/api/images/')) {
      return url.split('/api/images/')[1];
    }

    return null;
  } catch {
    return null;
  }
}

export { BUCKET_NAME, s3Client };
