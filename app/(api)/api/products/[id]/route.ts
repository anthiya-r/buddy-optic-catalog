import { errorResponse, handleApiError, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        id,
        status: 'active',
        deletedAt: null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    return successResponse(product, 'Product retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
