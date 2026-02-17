export const API_URLS = {
  AUTH: {
    SESSION: '/api/auth/get-session',
    SIGN_IN: '/api/auth/sign-in/username',
    SIGN_OUT: '/api/auth/sign-out',
  },
  ADMIN: {
    DASHBOARD: {
      STATS: '/api/admin/dashboard/stats',
    },
    PRODUCTS: {
      LIST: '/api/admin/products',
      DETAIL: (id: string) => `/api/admin/products/${id}`,
      STATUS: (id: string) => `/api/admin/products/${id}/status`,
    },
    CATEGORIES: {
      LIST: '/api/admin/categories',
      DETAIL: (id: string) => `/api/admin/categories/${id}`,
      REORDER: '/api/admin/categories/reorder',
    },
    UPLOAD: {
      IMAGE: '/api/admin/upload/image',
    },
    CHANGE_PASSWORD: '/api/admin/change-password',
  },
  PUBLIC: {
    PRODUCTS: {
      LIST: '/api/products',
      DETAIL: (id: string) => `/api/products/${id}`,
    },
    CATEGORIES: {
      LIST: '/api/categories',
    },
  },
  IMAGES: {
    GET: (filename: string) => `/api/images/getImage/${filename}`,
  },
} as const;
