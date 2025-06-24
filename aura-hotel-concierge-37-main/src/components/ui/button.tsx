
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hotel-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden shadow-elegant hover:shadow-luxury transform hover:-translate-y-1 active:translate-y-0 font-montserrat",
  {
    variants: {
      variant: {
        default: "bg-luxury-gradient text-white hover:shadow-lg border border-hotel-burgundy/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transform before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 border border-red-500/20",
        outline:
          "border-2 border-hotel-burgundy/30 bg-hotel-pearl hover:bg-hotel-cream hover:text-hotel-burgundy text-hotel-burgundy hover:border-hotel-gold transition-colors",
        secondary:
          "bg-gold-gradient text-hotel-burgundy hover:shadow-gold border border-hotel-gold/20 font-semibold before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transform before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700",
        ghost: "hover:bg-hotel-cream/50 hover:text-hotel-burgundy transition-colors",
        link: "text-hotel-burgundy underline-offset-4 hover:underline font-medium",
        creative: "bg-burgundy-gradient text-white overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:translate-x-[100%] before:transition-transform before:duration-700 border border-hotel-burgundy/20 shadow-luxury",
        gold: "bg-gold-gradient text-hotel-burgundy overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:translate-x-[100%] before:transition-transform before:duration-700 border border-hotel-gold/20 font-semibold shadow-gold",
        elegant: "bg-hotel-pearl text-hotel-charcoal border-2 border-hotel-beige hover:border-hotel-sand hover:bg-hotel-cream transition-all",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 rounded-xl px-6 text-xs",
        lg: "h-14 rounded-2xl px-10 text-base",
        icon: "h-12 w-12 rounded-full",
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
