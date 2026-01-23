import { withAuth } from '@/lib/api-auth';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

async function patchHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
  userId: string,
) {
  try {
    const { id } = await context.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return errorResponse('Product not found', 404);
    }

    if (existingProduct.deletedAt) {
      return errorResponse('Cannot update status of deleted product', 400);
    }

    const newStatus = existingProduct.status === 'active' ? 'hidden' : 'active';

    const product = await prisma.product.update({
      where: { id },
      data: {
        status: newStatus,
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

    return successResponse(product, `Product status changed to ${newStatus}`);
  } catch (error) {
    return handleApiError(error);
  }
}

export const PATCH = withAuth(patchHandler);
