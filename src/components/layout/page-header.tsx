// @file src/components/layout/page-header.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  description?: React.ReactNode
  eyebrow?: string
  actions?: React.ReactNode
  titleClassName?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  titleClassName,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("page-header", className)}>
      <div className="page-header-content">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className={cn("page-title", titleClassName)}>{title}</h1>
        {description ? (
          typeof description === "string" ? (
            <p className="page-description">{description}</p>
          ) : (
            description
          )
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:w-auto">
          {actions}
        </div>
      ) : null}
    </header>
  )
}
