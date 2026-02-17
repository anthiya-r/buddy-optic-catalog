import { withAuth } from '@/lib/api-auth';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';

async function getHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
  userId: string,
) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
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

const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  color: z.string().min(1, 'Color is required').optional(),
  images: z.string().optional(),
  size: z.string().min(1, 'Size is required').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  status: z.enum(['active', 'hidden']).optional(),
});

async function putHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
  userId: string,
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return errorResponse('Product not found', 404);
    }

    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });

      if (!category) {
        return errorResponse('Category not found', 404);
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
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

    return successResponse(product, 'Product updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

async function deleteHandler(
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
      return errorResponse('Product already deleted', 400);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return successResponse(product, 'Product deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler);
