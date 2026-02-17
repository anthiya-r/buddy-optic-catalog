import { ApiReference } from '@scalar/nextjs-api-reference';

const config = {
  spec: {
    url: '/openapi.yaml',
  },
  theme: 'mars' as const,
};

export const GET = ApiReference(config);
