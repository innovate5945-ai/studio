// @file src/lib/utils.ts
/**
 * @overview Tailwind className 병합 유틸 (clsx + tailwind-merge).
 *
 * @call-flow
 * 1. 컴포넌트에서 조건부·variant className 조합
 * 2. cn(...inputs) — clsx로 flatten 후 twMerge로 충돌 해소
 *
 * @see src/components/ui/* (shadcn 컴포넌트 공통 패턴)
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** clsx + tailwind-merge로 className 문자열을 병합합니다. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
