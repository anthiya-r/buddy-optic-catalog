interface RequestOptions extends RequestInit {
  timeout?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

const handleNavigation = (path: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
};

async function request<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
  const url = endpoint;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...(!(options?.body instanceof FormData) ? defaultHeaders : {}),
      ...options?.headers,
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      handleNavigation('/auth/login');
      return {
        success: false,
        message: 'Unauthorized - Please login again',
        statusCode: 401,
      } as ApiResponse<T>;
    }

    if (response.status === 403) {
      return {
        success: false,
        message: 'Access denied - Insufficient permissions',
        statusCode: 403,
      } as ApiResponse<T>;
    }

    const result: ApiResponse<T> = await response.json();
    return {
      ...result,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('API Fetch Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'A network error occurred',
    } as ApiResponse<T>;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) => {
    const isFormData = body instanceof FormData;

    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      headers: {
        ...options?.headers,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });
  },

  put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    }),
};
