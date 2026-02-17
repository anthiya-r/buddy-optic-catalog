import { withAuth } from '@/lib/api-auth';
import { handleApiError, successResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const reorderSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string().uuid(),
      sortOrder: z.number().int().min(0),
    }),
  ),
});

async function putHandler(request: NextRequest, context: {}, userId: string) {
  try {
    const body = await request.json();
    const validatedData = reorderSchema.parse(body);

    await prisma.$transaction(
      validatedData.orders.map((item) =>
        prisma.category.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    const categories = await prisma.category.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return successResponse(categories, 'Categories reordered successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export const PUT = withAuth(putHandler);
