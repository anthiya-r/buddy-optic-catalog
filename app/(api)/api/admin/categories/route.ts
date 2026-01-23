import { withAuth } from '@/lib/api-auth';
import { handleApiError, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

async function handler(request: NextRequest, context: {}, userId: string) {
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

export const GET = withAuth(handler);
