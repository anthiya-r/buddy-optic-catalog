/**
 * API Response Status Codes and Messages
 * Centralized constants for consistent API handling
 */

export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;

/**
 * Toast notification messages
 * DRY principle: single source of truth for user messages
 */
export const TOAST_MESSAGES = {
  // Success messages
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  PRODUCT_STATUS_HIDDEN: 'Product hidden successfully',
  PRODUCT_STATUS_SHOWN: 'Product shown successfully',

  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',
  CATEGORY_STATUS_HIDDEN: 'Category hidden successfully',
  CATEGORY_STATUS_SHOWN: 'Category shown successfully',
  CATEGORY_REORDERED: 'Categories reordered successfully',

  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PASSWORD_CHANGED: 'Password changed successfully',

  // Error messages
  INVALID_CREDENTIALS: 'Invalid username or password',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  NETWORK_ERROR: 'Network error occurred',
  VALIDATION_ERROR: 'Please check your input',

  // Warnings
  CANNOT_DELETE_WITH_PRODUCTS: 'Cannot delete category with products',
} as const;

/**
 * Request configuration
 * Reusable request options and headers
 */
export const REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
} as const;

/**
 * Pagination defaults
 * DRY principle for consistent pagination
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * File upload configuration
 * Centralized upload constraints
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp'],
} as const;

/**
 * Validation constraints
 * Reusable validation limits
 */
export const VALIDATION_CONSTRAINTS = {
  PRODUCT_NAME_MIN: 1,
  PRODUCT_NAME_MAX: 255,
  PRODUCT_COLOR_MIN: 1,
  PRODUCT_COLOR_MAX: 100,

  CATEGORY_NAME_MIN: 1,
  CATEGORY_NAME_MAX: 255,
  CATEGORY_SLUG_MIN: 1,
  CATEGORY_SLUG_MAX: 100,

  USERNAME_MIN: 3,
  USERNAME_MAX: 50,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 100,
} as const;

/**
 * Search and filter defaults
 * Consistent search behavior
 */
export const SEARCH_CONFIG = {
  DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 1,
  MAX_SEARCH_LENGTH: 100,
} as const;
