/**
 * UI Component Configuration
 * Centralized styling configuration to follow DRY principle
 */

import { CI_COLORS } from './colors';

export const UI_CONFIG = {
  button: {
    primary: {
      base: 'bg-yellow-100 text-slate-900 hover:bg-yellow-200',
      focus: 'focus:ring-orange-400',
      active: 'active:bg-yellow-300',
    },
    secondary: {
      base: 'bg-orange-400 text-white hover:bg-orange-500',
      focus: 'focus:ring-orange-600',
      active: 'active:bg-orange-600',
    },
    destructive: {
      base: 'bg-red-500 text-white hover:bg-red-600',
      focus: 'focus:ring-red-700',
      active: 'active:bg-red-700',
    },
    ghost: {
      base: 'hover:bg-yellow-50 text-slate-900',
      focus: 'focus:ring-orange-300',
    },
  },

  card: {
    default:
      'bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow',
    elevated: 'bg-white border border-slate-200 rounded-2xl shadow-lg',
  },

  badge: {
    primary: 'bg-yellow-100 text-slate-900',
    secondary: 'bg-orange-100 text-orange-900',
    success: 'bg-green-100 text-green-900',
    warning: 'bg-amber-100 text-amber-900',
    error: 'bg-red-100 text-red-900',
  },

  input: {
    base: 'bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-orange-400',
    error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
  },

  // Rounded variants
  radius: {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },
} as const;

// Gradient combinations
export const GRADIENTS = {
  primary: `from-[${CI_COLORS.primary}] to-[${CI_COLORS.tertiary}]`,
  secondary: `from-[${CI_COLORS.secondary}] to-[${CI_COLORS.primary}]`,
  warm: 'from-yellow-100 via-orange-100 to-orange-200',
} as const;
