import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-neon-hover glow-green hover:glow-green-strong',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-xl',
        outline:
          'rounded-full border border-border bg-transparent shadow-sm hover:border-primary/50 hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-xl',
        ghost: 'hover:bg-accent hover:text-accent-foreground rounded-xl',
        link: 'text-primary underline-offset-4 hover:underline rounded-none',
        neon: 'border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 glow-green rounded-full',
        glow: 'bg-primary text-primary-foreground glow-green-ultra hover:scale-[1.03] hover:bg-neon-hover active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-5 py-2 rounded-xl [&_svg]:size-4',
        sm: 'h-8 rounded-full px-4 text-xs [&_svg]:size-3.5',
        lg: 'h-12 rounded-full px-8 text-base [&_svg]:size-5',
        xl: 'h-16 rounded-full px-12 text-lg font-semibold [&_svg]:size-6',
        icon: 'h-10 w-10 rounded-xl [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
