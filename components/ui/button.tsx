import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-amber-200 text-slate-900 hover:bg-amber-300 font-semibold shadow-sm hover:shadow-md transition-all',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-200 dark:focus-visible:ring-red-400 dark:bg-red-600/80',
        outline:
          'border border-slate-300 bg-background shadow-xs hover:bg-amber-50 hover:text-slate-900 dark:bg-input/30 dark:border-input/50 dark:hover:bg-input/50',
        secondary:
          'bg-orange-400 text-white hover:bg-orange-500 font-semibold shadow-sm hover:shadow-md',
        ghost: 'hover:bg-amber-100 hover:text-slate-900 dark:hover:bg-amber-950/30',
        link: 'text-orange-500 underline-offset-4 hover:underline hover:text-orange-600',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
