import { withAuth } from '@/lib/api-auth';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').optional(),
  isActive: z.boolean().optional(),
});

async function putHandler(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
  userId: string,
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return errorResponse('Category not found', 404);
    }

    const updateData: any = {};

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
      updateData.slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    if (validatedData.isActive !== undefined) {
      updateData.isActive = validatedData.isActive;
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return successResponse(category, 'Category updated successfully');
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

    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!existingCategory) {
      return errorResponse('Category not found', 404);
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return errorResponse(
        `ไม่สามารถลบหมวดหมู่ได้ เนื่องจากมีสินค้าอยู่ ${existingCategory._count.products} รายการ`,
        400
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return successResponse(null, 'Category deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export const PUT = withAuth(putHandler);
export const DELETE = withAuth(deleteHandler);
