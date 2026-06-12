"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  FileText,
  MessageSquareText,
  Settings,
  Building2,
  UserCircle,
  TrendingUp,
  Target,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useAuthStore, type UserRole } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Only routes that actually exist — no dead links.
const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  super_admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  ],
  school_admin: [
    { label: "Dashboard", href: "/school", icon: LayoutDashboard },
  ],
  teacher: [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Exams & Grading", href: "/teacher/exams", icon: ClipboardList },
    { label: "AI Assistant", href: "/teacher/ai-chat", icon: MessageSquareText },
  ],
  student: [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "AI Tutor", href: "/student/ai-chat", icon: MessageSquareText },
  ],
  parent: [
    { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();

  const role = user?.role || "teacher";
  const navItems = NAV_CONFIG[role] || NAV_CONFIG.teacher;

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center px-4 h-16 shrink-0">
        <span className="font-display text-xl font-semibold tracking-tight shrink-0">
          E<span className="text-brand">.</span>
        </span>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-display text-xl font-semibold tracking-tight whitespace-nowrap overflow-hidden"
            >
              duInsight
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <Separator className="mx-3" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand/10 text-brand shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-brand" : "")} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-brand"
                />
              )}
            </Link>
          );

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger className="w-full">
                  <div className="relative">{linkContent}</div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href} className="relative">{linkContent}</div>;
        })}
      </nav>

      <Separator className="mx-3" />

      {/* Collapse toggle */}
      <div className="px-3 py-2">
        <button
          onClick={toggleSidebarCollapsed}
          className="flex items-center justify-center w-full gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* User section */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="gradient-brand text-white text-xs font-bold">
              {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-sm font-medium truncate">
                  {user?.firstName || "User"} {user?.lastName || ""}
                </p>
                <p className="text-xs text-muted-foreground capitalize truncate">
                  {user?.role?.replace("_", " ") || "Teacher"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
