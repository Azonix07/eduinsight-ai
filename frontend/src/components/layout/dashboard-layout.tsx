"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";
import { useUIStore } from "@/stores/ui-store";
import { useAuthStore, type User } from "@/stores/auth-store";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Auth gate: only tokens are persisted across reloads (not the user object),
 * so on mount we (1) wait for the store to rehydrate, (2) redirect to /login
 * if there's no token, and (3) re-fetch the profile when the user is missing.
 */
function useAuthGuard() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready">("checking");

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const { accessToken, user, setUser, logout } = useAuthStore.getState();

      if (!accessToken) {
        router.replace("/login");
        return;
      }

      if (!user) {
        try {
          const res = await apiClient.get<User>("/auth/me");
          if (cancelled) return;
          setUser(res.data);
        } catch {
          if (cancelled) return;
          logout();
          router.replace("/login");
          return;
        }
      }

      if (!cancelled) setStatus("ready");
    };

    // zustand/persist rehydrates asynchronously — don't read tokens before it's done
    const persist = useAuthStore.persist;
    if (!persist || persist.hasHydrated()) {
      void check();
    } else {
      const unsub = persist.onFinishHydration(() => void check());
      return () => {
        cancelled = true;
        unsub();
      };
    }

    return () => {
      cancelled = true;
    };
  }, [router]);

  return status;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed } = useUIStore();
  const status = useAuthGuard();

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="eyebrow animate-pulse text-muted-foreground">Loading workspace</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[256px]"
        )}
      >
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
