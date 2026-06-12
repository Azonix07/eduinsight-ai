"use client";

import { motion } from "motion/react";
import { Users, ClipboardList, BarChart3, Clock, TrendingUp, TrendingDown, BrainCircuit, Lightbulb, AlertTriangle, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnimatedCounter } from "@/components/charts/animated-counter";
import { PerformanceTrend } from "@/components/charts/performance-trend";
import { SubjectRadar } from "@/components/charts/subject-radar";
import { ScoreDistribution } from "@/components/charts/score-distribution";

/* ─── Demo Data ───────────────────────────────────────────── */

interface TeacherStats {
  students: number;
  exams: number;
  avgScore: number;
  pending: number;
}

async function fetchTeacherStats(): Promise<TeacherStats> {
  const [students, exams, sheets] = await Promise.all([
    apiClient.get<{ total: number }>("/students", { limit: 1 }),
    apiClient.get<{ total: number }>("/exams", { limit: 1 }),
    apiClient.get<{ sheets: { evaluation?: { status?: string; percentage?: number } }[] }>(
      "/answer-sheets",
      { limit: 100 },
    ),
  ]);
  const sheetList = sheets.data.sheets ?? [];
  const completed = sheetList.filter((s) => s.evaluation?.status === "completed");
  const avg = completed.length
    ? completed.reduce((sum, s) => sum + (s.evaluation?.percentage ?? 0), 0) / completed.length
    : 0;
  return {
    students: students.data.total,
    exams: exams.data.total,
    avgScore: +avg.toFixed(1),
    pending: sheetList.length - completed.length,
  };
}

const TREND_DATA = [
  { date: "Jan", score: 72, average: 68 }, { date: "Feb", score: 75, average: 70 },
  { date: "Mar", score: 71, average: 69 }, { date: "Apr", score: 78, average: 72 },
  { date: "May", score: 82, average: 74 }, { date: "Jun", score: 80, average: 73 },
  { date: "Jul", score: 85, average: 75 }, { date: "Aug", score: 83, average: 76 },
  { date: "Sep", score: 88, average: 77 }, { date: "Oct", score: 86, average: 78 },
  { date: "Nov", score: 90, average: 79 }, { date: "Dec", score: 92, average: 80 },
];

const RADAR_DATA = [
  { subject: "Math", score: 85, fullMark: 100 }, { subject: "Physics", score: 78, fullMark: 100 },
  { subject: "Chemistry", score: 72, fullMark: 100 }, { subject: "Biology", score: 88, fullMark: 100 },
  { subject: "English", score: 91, fullMark: 100 }, { subject: "Social", score: 76, fullMark: 100 },
];

const DISTRIBUTION_DATA = [
  { range: "0-20", count: 2 }, { range: "21-40", count: 8 }, { range: "41-60", count: 35 },
  { range: "61-80", count: 120 }, { range: "81-100", count: 83 },
];

const TOP_STUDENTS = [
  { name: "Alice Johnson", grade: "10-A", score: 96, trend: "up" },
  { name: "Bob Smith", grade: "10-B", score: 94, trend: "up" },
  { name: "Carol Davis", grade: "10-A", score: 92, trend: "stable" },
  { name: "David Lee", grade: "10-C", score: 91, trend: "up" },
  { name: "Eva Martin", grade: "10-B", score: 89, trend: "down" },
];

const AI_INSIGHTS = [
  { icon: BrainCircuit, title: "Learning Pattern Detected", desc: "Class 10-A shows consistent improvement in problem-solving questions.", type: "info" },
  { icon: AlertTriangle, title: "At-Risk Students", desc: "7 students in Class 10-C need immediate intervention in Mathematics.", type: "warning" },
  { icon: Lightbulb, title: "Teaching Suggestion", desc: "Visual aids could improve Chemistry scores by an estimated 12%.", type: "tip" },
];

/* ─── Page Component ──────────────────────────────────────── */

export default function TeacherDashboard() {
  const user = useAuthStore((s) => s.user);
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Teacher";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const statsQ = useQuery({ queryKey: ["teacher-stats"], queryFn: fetchTeacherStats });
  const STATS = [
    { label: "Students", value: statsQ.data?.students ?? 0, icon: Users, note: "enrolled in your school", decimals: 0, suffix: "" },
    { label: "Exams", value: statsQ.data?.exams ?? 0, icon: ClipboardList, note: "created to date", decimals: 0, suffix: "" },
    { label: "Average Score", value: statsQ.data?.avgScore ?? 0, icon: BarChart3, note: "across AI-graded sheets", decimals: 1, suffix: "%" },
    { label: "Awaiting Grading", value: statsQ.data?.pending ?? 0, icon: Clock, note: "sheets in the queue", decimals: 0, suffix: "" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-3xl font-medium tracking-tight">
          {greeting}, <em className="italic text-brand">{displayName}</em>
        </h1>
        <p className="text-muted-foreground mt-2">Here&apos;s your class performance overview</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="glass border-border/50 hover:shadow-premium transition-all duration-500 group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    <p className="font-display text-3xl font-medium mt-1">
                      <AnimatedCounter value={stat.value} decimals={stat.decimals} />
                      {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-brand/[0.07] text-brand transition-transform duration-500 group-hover:-translate-y-0.5">
                    <stat.icon className="h-5 w-5" strokeWidth={1.7} />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {statsQ.isLoading ? "loading…" : stat.note}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceTrend data={TREND_DATA} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Subject Mastery</CardTitle>
            </CardHeader>
            <CardContent>
              <SubjectRadar data={RADAR_DATA} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreDistribution data={DISTRIBUTION_DATA} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Star className="h-5 w-5 text-warning" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TOP_STUDENTS.map((student, i) => (
                  <div key={student.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/30 transition-colors">
                    <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="gradient-brand text-white text-xs font-bold">
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.grade}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{student.score}%</p>
                      {student.trend === "up" && <TrendingUp className="h-3 w-3 text-success inline" />}
                      {student.trend === "down" && <TrendingDown className="h-3 w-3 text-destructive inline" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-brand" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {AI_INSIGHTS.map((insight) => (
                <div key={insight.title} className="p-3 rounded-xl bg-accent/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-1">
                    <insight.icon className={`h-4 w-4 ${insight.type === "warning" ? "text-warning" : insight.type === "tip" ? "text-success" : "text-brand"}`} />
                    <span className="text-xs font-semibold">{insight.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
