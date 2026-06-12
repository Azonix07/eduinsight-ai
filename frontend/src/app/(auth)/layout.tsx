import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create an account to access EduInsight AI",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grain relative min-h-screen bg-background">
      {/* faint ruled margin, like a ledger */}
      <div className="absolute inset-y-0 left-6 hidden w-px bg-brand/20 md:block lg:left-12" />

      <header className="relative z-10 flex items-center justify-between px-6 pt-7 lg:px-16">
        <Link href="/" className="font-display text-[1.35rem] font-semibold tracking-tight text-foreground">
          EduInsight<span className="text-brand">.</span>
        </Link>
        <span className="eyebrow hidden text-muted-foreground/70 sm:block">
          AI-powered assessment
        </span>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-9rem)] items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="relative z-10 pb-7 text-center">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground/60">
          © {new Date().getFullYear()} EduInsight AI
        </span>
      </footer>
    </div>
  );
}
