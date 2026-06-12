import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Display / headlines — Fraunces: a high-contrast literary serif. The editorial voice.
const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Body / UI — Inter, with OpenType features enabled in globals.css.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Labels / numerals — JetBrains Mono for ALL-CAPS eyebrows, captions, and tabular figures.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EduInsight AI — Intelligent Student Performance Analytics",
    template: "%s | EduInsight AI",
  },
  description:
    "AI-powered educational analytics platform that scans handwritten answer sheets, evaluates student performance, and provides actionable insights to educators, students, and parents.",
  keywords: [
    "education",
    "AI",
    "analytics",
    "student performance",
    "answer sheet evaluation",
    "OCR",
    "school management",
  ],
  authors: [{ name: "EduInsight AI" }],
  openGraph: {
    type: "website",
    title: "EduInsight AI — Intelligent Student Performance Analytics",
    description:
      "Transform education with AI-powered answer sheet analysis and performance insights.",
    siteName: "EduInsight AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
