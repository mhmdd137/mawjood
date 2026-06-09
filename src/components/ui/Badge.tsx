import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "text-gray-950 border-gray-200",
    success: "border-transparent bg-green-100 text-green-800",
    warning: "border-transparent bg-yellow-100 text-yellow-800",
    danger: "border-transparent bg-red-100 text-red-800",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
