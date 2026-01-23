import { handleApiError, successResponse } from '@/lib/api-response';
import { Prisma } from '@/lib/generated/prisma/client';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const color = searchParams.get('color');

    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: Prisma.ProductWhereInput = {
      status: 'active',
      deletedAt: null,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (color) {
      where.color = {
        contains: color,
        mode: 'insensitive',
      };
    }

    const totalCount = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
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

    return successResponse(
      {
        products,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
      'Products retrieved successfully',
    );
  } catch (error) {
    return handleApiError(error);
  }
}
