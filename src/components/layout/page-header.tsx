// @file src/components/layout/page-header.tsx
/**
 * @overview 페이지 제목·설명·액션 공통 헤더 — globals.css `.page-header` 유틸 사용.
 *
 * @call-flow
 * 1. dashboard pages → PageHeader { eyebrow, title, description, actions }
 * 2. `.page-title` / `.page-description` — 시각적 계층 통일
 *
 * @see src/app/globals.css, src/app/(dashboard)/settings/page.tsx
 */
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

/** 페이지 상단 eyebrow·제목·설명·액션 슬롯 헤더. */
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
