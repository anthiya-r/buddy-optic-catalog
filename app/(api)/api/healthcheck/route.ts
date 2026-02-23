import { handleApiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

const REQUIRED_ENV_VARS = [
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'NEXT_PUBLIC_BETTER_AUTH_URL',
  'DATABASE_URL',
  'S3_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'S3_BUCKET_NAME',
] as const;

export async function GET() {
  try {
    // Check environment variables
    const envChecks = REQUIRED_ENV_VARS.reduce(
      (acc, key) => {
        acc[key] = !!process.env[key];
        return acc;
      },
      {} as Record<string, boolean>,
    );

    const missingEnvVars = Object.entries(envChecks)
      .filter(([, present]) => !present)
      .map(([key]) => key);

    // Check database connectivity
    let dbStatus: 'ok' | 'error' = 'ok';
    let dbError: string | null = null;
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (err: any) {
      dbStatus = 'error';
      dbError = err?.message ?? 'Unknown database error';
    }

    const allEnvPresent = missingEnvVars.length === 0;
    const healthy = allEnvPresent && dbStatus === 'ok';

    const payload = {
      status: healthy ? 'ok' : 'degraded',
      timestamp: dayjs().format('DD MMM YYYY HH:mm:ss'),
      checks: {
        env: {
          status: allEnvPresent ? 'ok' : 'missing',
          ...(missingEnvVars.length > 0 && { missing: missingEnvVars }),
          vars: envChecks,
        },
        database: {
          status: dbStatus,
          ...(dbError && { error: dbError }),
        },
      },
    };

    return NextResponse.json(payload, { status: healthy ? 200 : 503 });
  } catch (error) {
    return handleApiError(error);
  }
}
