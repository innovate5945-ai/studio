// @file src/components/ui/skeleton.tsx
/** @overview shadcn/ui 프리미티브 — 비즈니스 로직 없음. */
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
