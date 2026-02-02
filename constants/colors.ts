/**
 * Buddy Optical CI Color Palette
 * Centralized color definitions following SOLID principles
 */

export const CI_COLORS = {
  primary: '#FFE8BF', // Light cream/yellow
  secondary: '#CC9B71', // Warm brown
  tertiary: '#FFF4C7', // Lighter cream

  // Extended palette for UI
  dark: '#1a1a1a', // Dark navy/black
  white: '#FFFFFF',

  // Semantic colors
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
} as const;

// Tailwind safe colors mapping
export const COLOR_CLASSES = {
  primary: 'from-yellow-200 to-orange-100',
  secondary: 'from-orange-400 to-orange-300',
  accent: 'text-orange-600',
  background: 'bg-slate-50',
  foreground: 'text-slate-900',
} as const;
