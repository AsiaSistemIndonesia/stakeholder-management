"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Map,
  AlertTriangle,
  Network,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useSidebar } from "@/components/layout/sidebar-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const menuItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Stakeholder",
    href: "/stakeholder",
    icon: Users,
  },
  {
    label: "Organisasi",
    href: "/organisasi",
    icon: Building2,
  },
  {
    label: "Peta Interaktif",
    href: "/peta",
    icon: Map,
  },
  {
    label: "Laporan Insiden",
    href: "/insiden",
    icon: AlertTriangle,
  },
  {
    label: "Struktur Fungsi",
    href: "/fungsi",
    icon: Network,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "max-lg:translate-x-[-100%]",
          !collapsed && "max-lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={36}
                  height={36}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-sidebar-foreground">
                    Pertamina Drilling
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Stakeholder Platform
                  </span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform text-white",
                  collapsed && "rotate-180",
                )}
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-sidebar-border p-3 space-y-2">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Pengaturan</span>}
            </Link>

            {/* User Profile */}
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sidebar-accent",
                collapsed && "justify-center",
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {(user?.nama ?? "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.nama ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {(user?.role ?? "").replace("_", " ").toUpperCase()}
                  </p>
                </div>
              )}
              {!collapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={logout}
                  aria-label="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-background/80 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
