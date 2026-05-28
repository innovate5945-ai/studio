// @file src/app/(dashboard)/review/page.tsx
/**
 * @overview 복기 일지 경로 별칭 — /review → /reviews 리다이렉트.
 *
 * @call-flow
 * 1. /review (no id) → ReviewRedirectPage
 * 2. redirect("/reviews") — canonical 목록 URL
 *
 * @see src/app/(dashboard)/reviews/page.tsx
 */
import { redirect } from "next/navigation"

export default function ReviewRedirectPage() {
  redirect("/reviews")
}
