"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. Please request a new one.");
      return;
    }

    const verify = async () => {
      try {
        await apiClient.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } catch {
        setStatus("error");
        setMessage("Verification failed. The link may have expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <Card className="glass-strong shadow-premium border-0 w-full max-w-md">
      <CardHeader className="text-center pb-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
            status === "success"
              ? "bg-success"
              : status === "error"
              ? "bg-destructive"
              : "gradient-brand"
          }`}
        >
          {status === "loading" && (
            <Loader2 className="h-7 w-7 text-white animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="h-7 w-7 text-white" />
          )}
          {status === "error" && <XCircle className="h-7 w-7 text-white" />}
        </motion.div>
        <CardTitle className="text-2xl font-heading font-bold">
          {status === "loading" && "Verifying email..."}
          {status === "success" && "Email verified!"}
          {status === "error" && "Verification failed"}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {message}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center">
        {status === "success" && (
          <Button
            asChild
            className="gradient-brand text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Link href="/login">Continue to sign in</Link>
          </Button>
        )}
        {status === "error" && (
          <div className="space-y-2">
            <Button asChild variant="outline">
              <Link href="/register">Create new account</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Suspense
        fallback={
          <Card className="glass-strong shadow-premium border-0 w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </CardContent>
          </Card>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </motion.div>
  );
}
