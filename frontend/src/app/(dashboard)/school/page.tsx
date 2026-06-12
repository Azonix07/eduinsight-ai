"use client";

import { motion } from "motion/react";
import { Users, UserCircle, BookOpen, BarChart3, TrendingUp, AlertTriangle, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AnimatedCounter } from "@/components/charts/animated-counter";
import { PerformanceTrend } from "@/components/charts/performance-trend";
import { ScoreDistribution } from "@/components/charts/score-distribution";

const TREND_DATA = [
  { date: "Jan", score: 74 }, { date: "Feb", score: 76 }, { date: "Mar", score: 75 },
  { date: "Apr", score: 78 }, { date: "May", score: 80 }, { date: "Jun", score: 79 },
  { date: "Jul", score: 82 }, { date: "Aug", score: 81 }, { date: "Sep", score: 84 },
  { date: "Oct", score: 83 }, { date: "Nov", score: 86 }, { date: "Dec", score: 88 },
];

const DEPT_DATA = [
  { range: "Science", count: 82 }, { range: "Math", count: 78 },
  { range: "English", count: 86 }, { range: "Social", count: 74 },
  { range: "Languages", count: 80 }, { range: "Arts", count: 88 },
];

const TEACHERS = [
  { name: "Ms. Thompson", dept: "Mathematics", classes: 4, avgScore: 82 },
  { name: "Mr. Rodriguez", dept: "Science", classes: 3, avgScore: 78 },
  { name: "Dr. Patel", dept: "English", classes: 5, avgScore: 88 },
  { name: "Mrs. Kim", dept: "Social Science", classes: 3, avgScore: 76 },
];

const ALERTS = [
  { student: "James Wilson", issue: "Risk of failure in Mathematics", severity: "critical" },
  { student: "Sarah Brown", issue: "Declining performance in Physics", severity: "warning" },
  { student: "Mike Chen", issue: "Missing 3 consecutive exams", severity: "critical" },
];

export default function SchoolAdminDashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold">
          <span className="text-gradient">Lincoln Academy</span> Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">School-wide performance overview</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Students", value: 1248, icon: Users, color: "from-violet-500 to-purple-600" },
          { label: "Total Teachers", value: 48, icon: UserCircle, color: "from-blue-500 to-cyan-600" },
          { label: "Subjects", value: 24, icon: BookOpen, color: "from-emerald-500 to-green-600" },
          { label: "Avg Score", value: 78, icon: BarChart3, suffix: "%", color: "from-amber-500 to-yellow-600" },
          { label: "Pass Rate", value: 92, icon: TrendingUp, suffix: "%", color: "from-rose-500 to-pink-600" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass border-border/50 hover:shadow-premium transition-all group">
              <CardContent className="p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-brand/[0.07] text-brand transition-transform duration-500 group-hover:-translate-y-0.5">
                  <stat.icon className="h-4 w-4" strokeWidth={1.7} />
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-heading font-bold mt-0.5">
                  <AnimatedCounter value={stat.value} />{stat.suffix}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader><CardTitle className="text-lg font-heading">School Performance Trend</CardTitle></CardHeader>
            <CardContent><PerformanceTrend data={TREND_DATA} /></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader><CardTitle className="text-lg font-heading">Department Performance</CardTitle></CardHeader>
            <CardContent><ScoreDistribution data={DEPT_DATA} /></CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="text-lg font-heading">Teacher Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TEACHERS.map((t) => (
                  <div key={t.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/30 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand text-white text-sm font-bold">{t.name[0]}{t.name.split(" ")[1]?.[0]}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-muted-foreground">{t.dept} · {t.classes} classes</p></div>
                    <div className="text-right"><p className="text-sm font-bold">{t.avgScore}%</p><p className="text-xs text-muted-foreground">avg score</p></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-brand" />AI Prediction Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ALERTS.map((alert) => (
                <div key={alert.student} className={`p-3 rounded-xl border ${alert.severity === "critical" ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={`h-4 w-4 ${alert.severity === "critical" ? "text-destructive" : "text-warning"}`} />
                    <span className="text-xs font-semibold">{alert.student}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.issue}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
