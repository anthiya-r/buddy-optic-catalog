import { withAuth } from '@/lib/api-auth';
import { handleApiError, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma/client';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  isActive: z.boolean().optional().default(true),
});

async function getHandler(request: NextRequest, context: {}, userId: string) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where: Prisma.CategoryWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.category.count({ where });
    const totalPages = Math.ceil(totalCount / limit);

    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        sortOrder: 'asc',
      },
      skip,
      take: limit,
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

    return successResponse(
      {
        categories: categoriesWithCount,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      },
      'Categories retrieved successfully'
    );
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
