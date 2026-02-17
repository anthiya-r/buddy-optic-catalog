/**
 * Layout Components
 * Reusable layout wrappers following SOLID principles
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Admin Page Container
 * Single Responsibility: consistent admin page layout
 */
export const AdminPageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('p-4 md:p-6 space-y-6', className)}>
      {children}
    </div>
  );
};

/**
 * Page Header Component
 * Reusable header for pages
 */
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', className)}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-slate-500">{subtitle}</p>}
      </div>
      {action && action}
    </div>
  );
};

/**
 * Section Header Component
 * Reusable section title
 */
interface SectionHeaderProps {
  title: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  className,
}) => {
  return (
    <h2 className={cn('text-3xl font-bold text-slate-900 mb-6', className)}>
      {title}
    </h2>
  );
};

/**
 * Grid Container Component
 * Responsive grid wrapper
 */
interface GridContainerProps {
  children: React.ReactNode;
  columns?: 'auto' | 'two' | 'three' | 'four';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const columnClasses = {
  auto: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  two: 'grid-cols-2',
  three: 'grid-cols-3',
  four: 'grid-cols-4',
};

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  columns = 'auto',
  gap = 'md',
  className,
}) => {
  return (
    <div
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Empty State Component
 * DRY: Reusable empty state message
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-amber-300 text-4xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-500 mb-4">{description}</p>}
      {action && action}
    </div>
  );
};

/**
 * Loading State Component
 * Consistent loading indicator
 */export const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center py-12">
      <div className="animate-spin">
        <div className="h-8 w-8 border-4 border-amber-200 border-t-orange-400 rounded-full" />
      </div>
    </div>
  );
};
