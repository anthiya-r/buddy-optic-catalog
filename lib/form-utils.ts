/**
 * Form Utilities and Validation Schemas
 * Centralized form handling following SOLID principles
 */

import { z } from 'zod';

/**
 * Validation error messages
 * Centralized to follow DRY principle
 */
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  minLength: (min: number) => `Minimum ${min} characters required`,
  maxLength: (max: number) => `Maximum ${max} characters allowed`,
  email: 'Invalid email address',
  url: 'Invalid URL',
  uuid: 'Invalid ID format',
  positive: 'Must be a positive number',
} as const;

/**
 * Product Form Schema
 * DRY schema definition used across create and update forms
 */
export const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Product name too long'),
  color: z.string().min(1, 'Color is required').max(100, 'Color name too long'),
  categoryId: z.string().uuid('Invalid category'),
  status: z.enum(['active', 'hidden']).default('active'),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

/**
 * Category Form Schema
 * Reusable schema for category operations
 */
export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255, 'Category name too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  isActive: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

/**
 * Form error extractor
 * Single responsibility: extract and format validation errors
 */
export const extractFormErrors = (error: unknown): Record<string, string> => {
  if (error instanceof z.ZodError) {
    const errors: Record<string, string> = {};
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      if (path) {
        errors[path] = err.message;
      }
    });
    return errors;
  }
  return {};
};

/**
 * Form state initializer
 * Reusable function to initialize form state with default values
 */
export const initializeFormState = <T extends Record<string, string | number | boolean | string[]>>(
  defaultValues: T,
  overrides?: Partial<T>,
): T => {
  return { ...defaultValues, ...overrides };
};

/**
 * API error handler
 * Centralized error handling for API responses
 */
export const handleApiError = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    if ('message' in error) return String(error.message);
    if ('error' in error && typeof error.error === 'object' && 'message' in error.error) {
      return String(error.error.message);
    }
  }
  return 'An unexpected error occurred';
};
