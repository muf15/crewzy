"use client"

import type * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

export function Avatar({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600",
        className,
      )}
    >
      {children}
    </div>
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full", className)} {...props} />
  )
}

export function AvatarFallback({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

// function AvatarFallback({
//   className,
//   ...props
// }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
//   return (
//     <AvatarPrimitive.Fallback
//       data-slot="avatar-fallback"
//       className={cn(
//         "bg-muted flex size-full items-center justify-center rounded-full",
//         className
//       )}
//       {...props}
//     />
//   )
// }

export { AvatarImage }
