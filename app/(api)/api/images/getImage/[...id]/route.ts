import { getFromS3 } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string[] }> }) {
  try {
    const { id } = await params;

    console.log('Received request for image with ID:', id);

    if (!id || id.length === 0) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    // Join path segments to form the S3 key (e.g., ['products', 'image.png'] -> 'products/image.png')
    const key = id.join('/');

    // Get image from S3 using the key
    const { buffer, contentType } = await getFromS3(key);

    console.log('buffer: ', buffer);
    console.log('contentType: ', contentType);

    // Return the image as binary with appropriate headers
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType || 'image/jpeg', // Fallback just in case
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(), // Good practice for binary responses
      },
    });
  } catch (error) {
    console.error('Get image error:', error);

    // Check if it's a "not found" error from S3
    if ((error as { name?: string }).name === 'NoSuchKey') {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to retrieve image' }, { status: 500 });
  }
}
