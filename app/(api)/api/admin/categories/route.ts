import { withAuth } from '@/lib/api-auth';
import { handleApiError, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  isActive: z.boolean().optional().default(true),
});

async function getHandler(request: NextRequest, context: {}, userId: string) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
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

    const categoriesWithCount = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      productCount: cat._count.products,
    }));

    return successResponse(categoriesWithCount, 'Categories retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

async function postHandler(request: NextRequest, context: {}, userId: string) {
  try {
    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Get max sortOrder
    const maxSortOrder = await prisma.category.aggregate({
      _max: {
        sortOrder: true,
      },
    });

    const newSortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug,
        sortOrder: newSortOrder,
        isActive: validatedData.isActive,
      },
    });

    return successResponse(category, 'Category created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
