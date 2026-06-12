"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Capabilities", href: "#features" },
  { label: "Process", href: "#how-it-works" },
  { label: "Product", href: "#about" },
  { label: "Pricing", href: "#pricing" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`font-display text-[1.35rem] font-semibold tracking-tight text-foreground ${className}`}>
      EduInsight<span className="text-brand">.</span>
    </Link>
  );
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "border-border bg-background/95 backdrop-blur-sm" : "border-transparent bg-background/0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <nav className="flex h-16 items-center justify-between sm:h-[4.5rem]">
          <Wordmark />

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="link-underline text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <button
              onClick={toggleTheme}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link href="/login" className="link-underline text-sm font-medium text-foreground">
              Sign in
            </Link>
            <Button asChild size="sm" className="h-9 rounded-sm px-4">
              <Link href="/register">Start free trial</Link>
            </Button>
          </div>

          {/* mobile */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center text-foreground">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-border bg-background">
                <div className="mt-12 flex flex-col px-2">
                  {NAV_LINKS.map((link, i) => (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="flex items-baseline gap-4 border-b border-border py-4 text-left font-display text-xl font-medium text-foreground"
                    >
                      <span className="font-mono text-[0.65rem] text-brand">{String(i + 1).padStart(2, "0")}</span>
                      {link.label}
                    </button>
                  ))}
                  <div className="mt-8 flex flex-col gap-3">
                    <Button variant="outline" asChild className="h-11 rounded-sm">
                      <Link href="/login">Sign in</Link>
                    </Button>
                    <Button asChild className="h-11 rounded-sm">
                      <Link href="/register">Start free trial</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
