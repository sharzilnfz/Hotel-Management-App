
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-2xl border-2 border-hotel-beige/50 bg-gradient-to-br from-hotel-pearl to-hotel-cream px-5 py-4 text-base font-montserrat ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-hotel-charcoal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hotel-gold focus-visible:border-hotel-gold/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-elegant focus-visible:shadow-luxury text-hotel-charcoal",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
