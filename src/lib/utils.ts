// @file src/lib/utils.ts
/** @overview Tailwind className merge (clsx + tailwind-merge). */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
