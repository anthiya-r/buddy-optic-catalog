import { withAuth } from '@/lib/api-auth';
import { errorResponse, handleApiError, successResponse } from '@/lib/api-response';
import { Prisma } from '@/lib/generated/prisma/browser';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';

async function getHandler(request: NextRequest, _context: unknown, userId: string) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const skip = (page - 1) * limit;

    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    const search = searchParams.get('search');

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status && (status === 'active' || status === 'hidden')) {
      where.status = status;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const totalCount = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
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

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  color: z.string().min(1, 'Color is required'),
  images: z.string().min(1, 'At least one image is required'),
  categoryId: z.string().uuid('Invalid category ID'),
  size: z.string().min(1, 'Size is required'),
  status: z.enum(['active', 'hidden']).default('active'),
});

async function postHandler(request: NextRequest, _context: unknown, userId: string) {
  try {
    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        color: validatedData.color,
        images: validatedData.images,
        categoryId: validatedData.categoryId,
        size: validatedData.size,
        status: validatedData.status,
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

    return successResponse(product, 'Product created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
