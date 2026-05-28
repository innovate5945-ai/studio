"use client"

// @file src/components/layout/app-sidebar.tsx
/**
 * @overview 대시보드 사이드바 — mainNav·adminNav 라우트 네비게이션.
 *
 * @call-flow
 * 1. (dashboard)/layout → SidebarProvider → AppSidebar
 * 2. usePathname() — active route 하이라이트
 * 3. mainNav (Dashboard, Reviews, Reports, Upload) + adminNav (Settings, Audit, System)
 *
 * @see src/app/(dashboard)/layout.tsx, src/components/ui/sidebar.tsx
 */
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Settings, 
  UploadCloud, 
  BarChart3, 
  BookOpen, 
  ShieldAlert,
  History,
  LogOut
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

const mainNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Trade Logs", href: "/reviews", icon: BookOpen },
  { name: "Analytics", href: "/reports", icon: BarChart3 },
  { name: "CSV Upload", href: "/upload", icon: UploadCloud },
]

const adminNav = [
  { name: "Thresholds", href: "/settings", icon: ShieldAlert },
  { name: "Audit Trail", href: "/audit", icon: History },
  { name: "System Settings", href: "/system", icon: Settings },
]

/** 대시보드 레이아웃 좌측 collapsible 사이드바. */
export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-headline font-bold text-xl group-data-[collapsible=icon]:hidden">
            IronTrader
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="eyebrow px-4 py-2 group-data-[collapsible=icon]:hidden">
            Core Performance
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/reviews"
                        ? pathname === item.href || pathname.startsWith("/review")
                        : pathname === item.href
                    }
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="eyebrow px-4 py-2 group-data-[collapsible=icon]:hidden">
            Discipline & Risk
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-destructive hover:text-destructive/80">
              <Link href="/login">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}