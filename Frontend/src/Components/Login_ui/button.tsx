import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

type Variant = "default" | "outline" | "destructive" | "ghost"
type Size = "sm" | "md" | "lg"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"

const variants: Record<Variant, string> = {
  default: "bg-slate-900 text-white hover:bg-slate-800",
  outline: "border bg-white hover:bg-slate-50",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  ghost: "hover:bg-slate-100",
}

const sizes: Record<Size, string> = {
  sm: "h-8 px-3",
  md: "h-9 px-4",
  lg: "h-10 px-5",
}

const buttonVariants = cva(base, {
  variants: {
    variant: variants,
    size: sizes,
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
})

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
