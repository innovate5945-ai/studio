// @file src/hooks/use-mobile.tsx
/**
 * @overview 모바일 breakpoint (768px) 감지 훅 — shadcn Sidebar 반응형 레이아웃용.
 *
 * @call-flow
 * 1. mount 시 matchMedia(max-width: 767px) 구독
 * 2. resize/미디어 변경 → window.innerWidth < 768 판정
 * 3. useIsMobile() → boolean (초기 undefined는 false로 coalesce)
 *
 * @see src/components/ui/sidebar.tsx
 */
import * as React from "react"

const MOBILE_BREAKPOINT = 768

/** 뷰포트가 모바일 breakpoint 미만이면 true를 반환합니다. */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
