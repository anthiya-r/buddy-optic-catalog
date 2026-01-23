import { withAuth } from '@/lib/api-auth';
import { handleApiError, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

async function handler(request: NextRequest, context: {}, userId: string) {
  try {
    const totalProducts = await prisma.product.count({
      where: {
        deletedAt: null,
      },
    });

    const activeProducts = await prisma.product.count({
      where: {
        status: 'active',
        deletedAt: null,
      },
    });

    const hiddenProducts = await prisma.product.count({
      where: {
        status: 'hidden',
        deletedAt: null,
      },
    });

    const deletedProducts = await prisma.product.count({
      where: {
        deletedAt: {
          not: null,
        },
      },
    });

    const totalCategories = await prisma.category.count();

    const activeCategories = await prisma.category.count({
      where: {
        isActive: true,
      },
    });

    const productsByCategory = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
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
      orderBy: {
        sortOrder: 'asc',
      },
    });

    const stats = {
      products: {
        total: totalProducts,
        active: activeProducts,
        hidden: hiddenProducts,
        deleted: deletedProducts,
      },
      categories: {
        total: totalCategories,
        active: activeCategories,
      },
      productsByCategory: productsByCategory.map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: cat._count.products,
      })),
    };

    return successResponse(stats, 'Dashboard stats retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(handler);
