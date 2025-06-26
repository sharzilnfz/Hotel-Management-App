
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hotel-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white hover:bg-gray-800",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border-2 border-hotel-burgundy/30 bg-hotel-pearl hover:bg-hotel-cream hover:text-hotel-burgundy text-hotel-burgundy hover:border-hotel-gold transition-colors",
        secondary: "bg-gray-900 text-white hover:bg-gray-800",
        ghost: "hover:bg-hotel-cream/50 hover:text-hotel-burgundy transition-colors",
        link: "text-hotel-burgundy underline-offset-4 hover:underline font-medium",
        creative: "bg-gray-900 text-white hover:bg-gray-800",
        gold: "bg-gray-900 text-white hover:bg-gray-800",
        elegant: "bg-gray-900 text-white hover:bg-gray-800",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 rounded-md px-6 text-xs",
        lg: "h-14 rounded-md px-10 text-base",
        icon: "h-12 w-12 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
