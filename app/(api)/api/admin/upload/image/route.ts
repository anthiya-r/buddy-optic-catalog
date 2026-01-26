import { withAuth } from '@/lib/api-auth';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-response';
import { uploadToS3 } from '@/lib/s3';
import { NextRequest } from 'next/server';

async function postHandler(request: NextRequest, context: {}, userId: string) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse('No file uploaded', 400);
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse('Invalid file type. Only JPEG, PNG, and WebP are allowed', 400);
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return errorResponse('File size too large. Maximum size is 5MB', 400);
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `products/${timestamp}-${randomString}.${extension}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageUrl = await uploadToS3(buffer, filename, file.type);

    return successResponse({ url: imageUrl }, 'Image uploaded successfully');
  } catch (error) {
    console.error('Upload error:', error);
    return handleApiError(error);
  }
}

export const POST = withAuth(postHandler);
