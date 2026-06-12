"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { isAxiosError } from "axios";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post<{
        user: {
          _id: string;
          email: string;
          firstName: string;
          lastName: string;
          role: "super_admin" | "school_admin" | "teacher" | "student" | "parent";
          avatar?: string;
          school?: { _id: string; name: string; code: string };
          isEmailVerified: boolean;
        };
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", formData);

      const { user, accessToken, refreshToken } = response.data;
      login(user, accessToken, refreshToken);
      toast.success("Welcome back!", {
        description: `Signed in as ${user.firstName} ${user.lastName}`,
      });

      // Redirect based on role
      const roleRoutes: Record<string, string> = {
        super_admin: "/admin",
        school_admin: "/school",
        teacher: "/teacher",
        student: "/student",
        parent: "/parent",
      };
      router.push(roleRoutes[user.role] || "/");
    } catch (error: unknown) {
      const apiMessage = isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      toast.error("Login failed", {
        description: apiMessage || "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="rounded-sm border border-border bg-card shadow-premium">
        <CardHeader className="pb-2">
          <span className="eyebrow text-brand">Sign in</span>
          <CardTitle className="pt-3 font-display text-3xl font-medium tracking-tight">
            Welcome back<span className="text-brand">.</span>
          </CardTitle>
          <CardDescription className="pt-1 text-muted-foreground">
            Sign in to your EduInsight account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@school.edu"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                autoComplete="email"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand hover:text-brand/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  autoComplete="current-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-sm text-[0.95rem]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-brand hover:text-brand/80 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
