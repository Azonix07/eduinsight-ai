"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, type Variants } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/* ─── Motion ──────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

function Reveal({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      variants={stagger}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function Eyebrow({ children, number }: { children: React.ReactNode; number?: string }) {
  return (
    <motion.div variants={fadeUp} className="flex items-baseline gap-4">
      {number && <span className="eyebrow text-brand">{number}</span>}
      <span className="eyebrow text-muted-foreground">{children}</span>
      <span className="hidden h-px flex-1 self-center bg-border sm:block" />
    </motion.div>
  );
}

/* ─── Data ────────────────────────────────────────────────── */

const FEATURES = [
  { n: "01", title: "AI answer evaluation", desc: "Every answer graded against your marking scheme by Claude, with a written justification for each mark awarded — not just a number." },
  { n: "02", title: "Handwriting recognition", desc: "Scanned answer sheets are read page by page — messy handwriting, crossed-out work, and equations included." },
  { n: "03", title: "Deep analytics", desc: "Trend lines, rankings, and subject heatmaps that show precisely where each student stands, and where they're heading." },
  { n: "04", title: "Reports for every reader", desc: "The same result, told four ways — for the teacher, the student, the parent, and the principal." },
  { n: "05", title: "Predictive insight", desc: "Risk of falling behind is flagged early, with a concrete recommendation for what to do about it." },
  { n: "06", title: "A study companion", desc: "Each student gets an AI tutor that knows their work — it explains mistakes and builds personal study plans." },
];

const STEPS = [
  { n: "1", title: "Upload", desc: "Drop in scanned answer sheets. PDF, JPG, PNG, or TIFF." },
  { n: "2", title: "Read", desc: "The AI reads the handwriting and structures every answer by question." },
  { n: "3", title: "Grade", desc: "Each answer is marked against your scheme, with written feedback." },
  { n: "4", title: "Understand", desc: "Reports, predictions, and study plans — ready before the next class." },
];

const QUOTES = [
  {
    quote: "I save fifteen hours a week on grading, and the per-question feedback is more thorough than what I used to write myself.",
    name: "James Rodriguez",
    role: "Mathematics, Westfield High",
    lead: true,
  },
  {
    quote: "The AI insights are remarkably accurate. It has changed how we support our students.",
    name: "Dr. Sarah Chen",
    role: "Principal, Lincoln Academy",
    lead: false,
  },
  {
    quote: "Finally I can see exactly where my child needs help. The reports are clear and genuinely useful.",
    name: "Priya Sharma",
    role: "Parent, Global International",
    lead: false,
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "$29",
    period: "per month",
    desc: "For small schools getting started.",
    features: ["Up to 100 students", "5 teachers", "AI evaluation", "Standard reports", "Email support"],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "per month",
    desc: "Full AI for growing institutions.",
    features: ["Up to 500 students", "Unlimited teachers", "Advanced evaluation", "Predictions & analytics", "AI study companion", "Priority support"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual agreement",
    desc: "For large, custom deployments.",
    features: ["Unlimited everything", "Custom AI models", "White-label", "API access", "Dedicated manager", "SLA guarantee"],
    cta: "Contact sales",
    highlighted: false,
  },
];

const INSTITUTIONS = ["Stanford Academy", "Cambridge Prep", "Global International", "Lincoln Academy", "Oxford Schools", "Harvard Prep"];

/* ─── Hero specimen: a graded answer sheet ────────────────── */

function InkLine({ w, className = "" }: { w: string; className?: string }) {
  return <div className={`h-[3px] rounded-full bg-foreground/[0.16] ${className}`} style={{ width: w }} />;
}

function GradedSheet() {
  return (
    <div className="relative" aria-hidden>
      {/* sheet behind */}
      <div className="absolute -right-3 top-3 hidden h-full w-full rotate-[1.6deg] rounded-sm border border-border bg-card sm:block" />

      {/* main sheet */}
      <div className="relative -rotate-[1.2deg] rounded-sm border border-border bg-card p-6 pl-12 shadow-premium sm:p-8 sm:pl-14">
        {/* ruled margin */}
        <div className="absolute inset-y-0 left-8 w-px bg-brand/30 sm:left-10" />

        {/* stamp */}
        <div className="absolute -right-4 -top-5 flex h-20 w-20 rotate-[8deg] items-center justify-center rounded-full border-2 border-brand text-brand">
          <div className="text-center leading-none">
            <div className="font-display text-2xl font-semibold">47</div>
            <div className="mx-auto my-1 h-px w-8 bg-brand/60" />
            <div className="font-mono text-[0.6rem] tracking-wider">50</div>
          </div>
        </div>

        <p className="eyebrow text-muted-foreground/80">Mathematics — Unit Test 1</p>
        <p className="mt-1 font-mono text-[0.65rem] text-muted-foreground/60">A. STUDENT · 10A-01 · PAGE 1 OF 3</p>

        <div className="mt-7 space-y-7">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[0.65rem] text-muted-foreground">Q1.</span>
              <span className="font-mono text-[0.65rem] text-brand">10 / 10</span>
            </div>
            <div className="mt-3 space-y-2.5">
              <InkLine w="92%" />
              <InkLine w="78%" />
              <InkLine w="85%" />
            </div>
            <p className="accent-serif mt-2.5 text-[0.8rem] text-brand">Correct — full marks. Clean factorisation.</p>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[0.65rem] text-muted-foreground">Q2.</span>
              <span className="font-mono text-[0.65rem] text-brand">7 / 10</span>
            </div>
            <div className="mt-3 space-y-2.5">
              <InkLine w="88%" />
              <InkLine w="64%" />
            </div>
            <p className="accent-serif mt-2.5 text-[0.8rem] text-brand">Right method; arithmetic slip in step 3.</p>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[0.65rem] text-muted-foreground">Q3.</span>
              <span className="font-mono text-[0.65rem] text-brand">9 / 10</span>
            </div>
            <div className="mt-3 space-y-2.5">
              <InkLine w="81%" />
              <InkLine w="90%" />
              <InkLine w="42%" />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground/70">
            Graded by EduInsight AI · reviewed by T. Okafor
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="grain min-h-screen bg-background">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pt-40 lg:pb-28">
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <motion.p variants={fadeUp} className="eyebrow text-muted-foreground">
                AI-powered assessment <span className="mx-2 text-brand">·</span> for schools that read closely
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="text-balance pt-7 font-display text-[2.9rem] font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-[5.2rem]"
              >
                Every answer, read.
                <br />
                Every student,{" "}
                <em className="font-normal italic text-brand">understood.</em>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-8 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                EduInsight reads handwritten exams, grades every answer with AI, and turns
                the results into clear guidance for teachers, students, and parents.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-6">
                <Button asChild size="lg" className="group h-12 rounded-sm px-7 text-[0.95rem]">
                  <Link href="/register">
                    Start free trial
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Link
                  href="#how-it-works"
                  className="link-underline text-[0.95rem] font-medium text-foreground"
                >
                  See how it works
                </Link>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="lg:col-span-5">
              <GradedSheet />
            </motion.div>
          </motion.div>
        </div>

        {/* stat rule */}
        <div className="border-y border-border">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
            {[
              { value: "10,000+", label: "Students assessed" },
              { value: "98%", label: "Grading accuracy" },
              { value: "15 hrs", label: "Saved weekly, per teacher" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-4 py-6 sm:block sm:py-8 sm:first:pl-0 sm:[&:not(:first-child)]:pl-8">
                <div className="font-display text-3xl font-medium tracking-tight sm:text-4xl">{s.value}</div>
                <div className="eyebrow mt-2 text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institutions ── */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/70">
          Trusted by{" "}
          {INSTITUTIONS.map((name, i) => (
            <span key={name}>
              <span className="text-foreground/70">{name}</span>
              {i < INSTITUTIONS.length - 1 && <span className="mx-2 text-brand">/</span>}
            </span>
          ))}
        </p>
      </div>

      {/* ── Features index ── */}
      <Reveal id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow number="No. 1">Capabilities</Eyebrow>
              <motion.h2 variants={fadeUp} className="text-balance pt-6 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                What the platform <em className="italic text-brand">does</em>
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-6 max-w-xs text-pretty text-base leading-relaxed text-muted-foreground">
                One pipeline from the scanned page to the parent–teacher conference.
                No icons, no dashboards-for-the-sake-of-dashboards — just the work.
              </motion.p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ul>
              {FEATURES.map((f) => (
                <motion.li key={f.n} variants={fadeUp} className="group border-t border-border last:border-b">
                  <div className="grid grid-cols-12 items-baseline gap-4 py-7 sm:py-8">
                    <span className="col-span-2 font-mono text-xs text-brand sm:col-span-1">{f.n}</span>
                    <h3 className="col-span-10 font-display text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-brand sm:col-span-4 sm:text-[1.65rem]">
                      {f.title}
                    </h3>
                    <p className="col-span-10 col-start-3 text-pretty text-[0.95rem] leading-relaxed text-muted-foreground sm:col-span-6 sm:col-start-auto">
                      {f.desc}
                    </p>
                    <ArrowUpRight className="col-span-1 hidden h-4 w-4 justify-self-end text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block" />
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* ── How it works — ink band ── */}
      <Reveal id="how-it-works" className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="flex items-baseline gap-4">
            <motion.span variants={fadeUp} className="eyebrow text-[oklch(0.72_0.14_264)]">No. 2</motion.span>
            <motion.span variants={fadeUp} className="eyebrow text-background/60">The process</motion.span>
            <motion.span variants={fadeUp} className="hidden h-px flex-1 self-center bg-background/20 sm:block" />
          </div>

          <motion.h2 variants={fadeUp} className="max-w-2xl text-balance pt-6 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            From a pile of papers to a plan —{" "}
            <em className="italic text-[oklch(0.72_0.14_264)]">in four steps.</em>
          </motion.h2>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden bg-background/15 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <motion.div key={step.n} variants={fadeUp} className="bg-foreground p-7 sm:p-8">
                <div className="font-display text-6xl font-medium text-background/25 sm:text-7xl">{step.n}</div>
                <h3 className="mt-6 font-display text-xl font-medium text-background">{step.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-background/65">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Product ── */}
      <Reveal id="about" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Eyebrow number="No. 3">The product</Eyebrow>
        <div className="grid grid-cols-1 gap-10 pt-6 lg:grid-cols-12">
          <motion.h2 variants={fadeUp} className="text-balance font-display text-4xl font-medium tracking-tight sm:text-5xl lg:col-span-5">
            A dashboard for every <em className="italic text-brand">reader</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground lg:col-span-7 lg:justify-self-end lg:self-end">
            Teachers see the class. Students see themselves. Parents see their child.
            Principals see the school. Same data — four honest views of it.
          </motion.p>
        </div>

        <motion.div variants={fadeUp} className="mt-14 overflow-hidden rounded-sm border border-border bg-card shadow-premium">
          {/* window bar */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
              app.eduinsight.ai / teacher
            </span>
            <span className="font-mono text-[0.65rem] text-muted-foreground/60">10A · Mathematics</span>
          </div>

          <div className="flex">
            {/* index sidebar */}
            <div className="hidden w-52 flex-col border-r border-border p-4 sm:flex">
              {["Dashboard", "Students", "Exams", "Analytics", "Reports", "AI Chat"].map((item, i) => (
                <div
                  key={item}
                  className={`flex items-baseline gap-3 border-b border-border/60 py-3 text-sm last:border-0 ${
                    i === 0 ? "text-brand" : "text-muted-foreground"
                  }`}
                >
                  <span className="font-mono text-[0.6rem]">{String(i + 1).padStart(2, "0")}</span>
                  {item}
                </div>
              ))}
            </div>

            {/* content */}
            <div className="flex-1 p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
                {[
                  { label: "Students", value: "248" },
                  { label: "Avg. score", value: "78.5%" },
                  { label: "Exams", value: "18" },
                  { label: "Evaluations", value: "1,240" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card p-4">
                    <div className="eyebrow text-muted-foreground/70">{stat.label}</div>
                    <div className="mt-2 font-display text-2xl font-medium tabular">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border border-border p-5">
                <div className="flex items-baseline justify-between">
                  <span className="eyebrow text-muted-foreground">Performance, this term</span>
                  <span className="font-mono text-[0.65rem] text-brand">▲ +9.2%</span>
                </div>
                <div className="mt-5 flex h-28 items-end gap-1.5">
                  {[40, 55, 45, 62, 70, 64, 80, 75, 86, 78, 92, 88].map((h, i) => (
                    <div key={i} className={`flex-1 ${i === 10 ? "bg-brand" : "bg-foreground/[0.18]"}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

              <div className="mt-6 border border-border">
                {[
                  ["Alice Johnson", "10-A", "96%"],
                  ["Bob Smith", "10-B", "94%"],
                  ["Carol Davis", "10-A", "92%"],
                ].map(([name, cls, score], i) => (
                  <div key={name} className="flex items-baseline gap-4 border-b border-border px-5 py-3 text-sm last:border-0">
                    <span className="font-mono text-[0.65rem] text-brand">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-medium">{name}</span>
                    <span className="font-mono text-[0.65rem] text-muted-foreground">{cls}</span>
                    <span className="font-mono text-sm tabular">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Reveal>

      {/* ── Voices ── */}
      <Reveal className="border-y border-border bg-surface/60">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <Eyebrow number="No. 4">From the staff room</Eyebrow>

          <div className="grid grid-cols-1 gap-14 pt-12 lg:grid-cols-12">
            {/* lead quote */}
            <motion.figure variants={fadeUp} className="lg:col-span-7">
              <div aria-hidden className="font-display text-7xl leading-none text-brand">&ldquo;</div>
              <blockquote className="-mt-4 text-balance font-display text-3xl font-medium leading-[1.18] tracking-tight sm:text-4xl">
                {QUOTES[0].quote}
              </blockquote>
              <figcaption className="mt-8 flex items-baseline gap-3">
                <span className="h-px w-10 self-center bg-brand" />
                <span className="text-sm font-medium">{QUOTES[0].name}</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{QUOTES[0].role}</span>
              </figcaption>
            </motion.figure>

            {/* side quotes */}
            <div className="space-y-12 lg:col-span-4 lg:col-start-9">
              {QUOTES.slice(1).map((q) => (
                <motion.figure key={q.name} variants={fadeUp} className="border-l border-border pl-6">
                  <blockquote className="text-pretty text-[0.95rem] leading-relaxed text-foreground/85">
                    &ldquo;{q.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4">
                    <span className="block text-sm font-medium">{q.name}</span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">{q.role}</span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Pricing ── */}
      <Reveal id="pricing" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Eyebrow number="No. 5">Pricing</Eyebrow>
        <motion.h2 variants={fadeUp} className="max-w-xl text-balance pt-6 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Plain terms, <em className="italic text-brand">printed clearly.</em>
        </motion.h2>

        <motion.div variants={fadeUp} className="mt-14 grid grid-cols-1 border border-border md:grid-cols-3 md:divide-x md:divide-border">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 max-md:border-b max-md:border-border max-md:last:border-0 sm:p-10 ${
                plan.highlighted ? "bg-card" : ""
              }`}
            >
              {plan.highlighted && (
                <span className="absolute right-0 top-0 bg-brand px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-brand-foreground">
                  Recommended
                </span>
              )}
              <span className="eyebrow text-muted-foreground">{plan.name}</span>
              <div className={`mt-6 font-display text-5xl font-medium tracking-tight sm:text-6xl ${plan.highlighted ? "text-brand" : ""}`}>
                {plan.price}
              </div>
              <span className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{plan.period}</span>
              <p className="mt-5 text-sm text-muted-foreground">{plan.desc}</p>

              <ul className="mt-8 flex-1 space-y-3 border-t border-border pt-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-foreground/85">
                    <span className="text-brand">—</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.highlighted ? "default" : "outline"}
                className="mt-9 h-11 w-full rounded-sm"
              >
                <Link href="/register">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </motion.div>
      </Reveal>

      {/* ── CTA band ── */}
      <Reveal className="bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <motion.p variants={fadeUp} className="eyebrow text-background/60">
            Begin this term
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mx-auto mt-6 max-w-3xl text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl"
          >
            Bring <em className="italic text-[oklch(0.72_0.14_264)]">insight</em> to your classroom.
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-10">
            <Button asChild size="lg" className="group h-13 rounded-sm px-8 text-base">
              <Link href="/register">
                Start your free trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-background/50">
            No credit card · 14-day trial · Cancel any time
          </motion.p>
        </div>
      </Reveal>

      <Footer />
    </div>
  );
}
