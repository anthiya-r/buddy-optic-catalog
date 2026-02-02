/**
 * UI Utility Functions
 * Following DRY and SOLID principles for reusable UI logic
 */

import { cn } from '@/lib/utils';

/**
 * Status Badge Configuration
 * Centralized badge styling based on status
 */
export const getStatusBadgeClasses = (status: 'active' | 'hidden' | boolean): string => {
  const isActive = typeof status === 'boolean' ? status : status === 'active';

  return cn(
    'cursor-pointer transition-colors',
    isActive
      ? 'bg-green-100 text-green-900 hover:bg-green-200'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  );
};

/**
 * Category Badge Configuration
 * Consistent styling for category badges
 */
export const getCategoryBadgeClasses = (): string => {
  return cn('border-amber-200 bg-amber-50 text-slate-700');
};

/**
 * Button Icon Styling
 * Consistent hover states for action buttons
 */
export const getActionButtonClasses = (type: 'edit' | 'delete'): string => {
  return cn(
    'transition-colors',
    type === 'edit' ? 'hover:bg-amber-100 hover:text-orange-600' : 'hover:bg-red-100',
  );
};

/**
 * Table Header Classes
 * Consistent styling for table headers
 */
export const getTableHeaderClasses = (): string => {
  return cn('bg-amber-50 border-amber-100 hover:bg-amber-50');
};

/**
 * Table Row Classes
 * Consistent styling for table rows
 */
export const getTableRowClasses = (): string => {
  return cn('border-amber-100 hover:bg-amber-50/50 transition-colors');
};

/**
 * Input Field Classes
 * Consistent styling for input fields
 */
export const getInputClasses = (): string => {
  return cn('border-amber-200 bg-white focus:ring-orange-400 focus:border-orange-400');
};

/**
 * Card Classes
 * Consistent styling for card components
 */
export const getCardClasses = (): string => {
  return cn('border-amber-100 bg-white shadow-sm hover:shadow-md transition-shadow');
};

/**
 * Get status display text with icon
 * Follows Single Responsibility Principle
 */
export const getStatusDisplay = (isActive: boolean): { icon: string; text: string } => {
  return {
    icon: isActive ? '✓' : '✕',
    text: isActive ? 'แสดง' : 'ซ่อน',
  };
};

/**
 * Price formatting utility
 * Reusable price formatting across the application
 */
export const formatPrice = (price: number): string => {
  return `฿${price.toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Image URL processing
 * Extract first image from comma-separated list
 */
export const getFirstImage = (images: string | undefined): string => {
  if (!images) return '/placeholder.png';

  const imageList = images.split(',').filter(Boolean);
  return imageList[0] || '/placeholder.png';
};

/**
 * Text truncation utility
 * Consistent text truncation across components
 */
export const truncateText = (text: string, length: number = 50): string => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};
