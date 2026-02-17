import { NextRequest } from 'next/server';
import { errorResponse } from './api-response';
import { auth } from './auth';

export async function requireAuth(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return { authenticated: false, error: errorResponse('Unauthorized', 401) };
    }

    return { authenticated: true, user: session.user };
  } catch (error) {
    console.error('Auth check error:', error);
    return { authenticated: false, error: errorResponse('Unauthorized', 401) };
  }
}

export function withAuth<T>(
  handler: (request: NextRequest, context: T, userId: string) => Promise<any>,
) {
  return async (request: NextRequest, context: T) => {
    const authResult = await requireAuth(request);

    if (!authResult.authenticated || !authResult.user) {
      return authResult.error;
    }

    return handler(request, context, authResult.user.id);
  };
}
