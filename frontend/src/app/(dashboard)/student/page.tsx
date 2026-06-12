"use client";

import { motion } from "motion/react";
import { ClipboardList, BarChart3, Trophy, TrendingUp, Target, Award, Flame, Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedCounter } from "@/components/charts/animated-counter";
import { PerformanceTrend } from "@/components/charts/performance-trend";
import { SubjectRadar } from "@/components/charts/subject-radar";
import { GrowthIndicator } from "@/components/charts/growth-indicator";

const TREND_DATA = [
  { date: "Jan", score: 68, average: 70 }, { date: "Feb", score: 72, average: 71 },
  { date: "Mar", score: 70, average: 72 }, { date: "Apr", score: 76, average: 73 },
  { date: "May", score: 80, average: 74 }, { date: "Jun", score: 78, average: 73 },
  { date: "Jul", score: 82, average: 75 }, { date: "Aug", score: 85, average: 76 },
  { date: "Sep", score: 83, average: 77 }, { date: "Oct", score: 88, average: 78 },
];

const RADAR_DATA = [
  { subject: "Math", score: 82, fullMark: 100 }, { subject: "Physics", score: 75, fullMark: 100 },
  { subject: "Chemistry", score: 68, fullMark: 100 }, { subject: "Biology", score: 90, fullMark: 100 },
  { subject: "English", score: 88, fullMark: 100 }, { subject: "Social", score: 73, fullMark: 100 },
];

const BADGES = [
  { icon: Trophy, label: "Top 10%", color: "from-amber-400 to-yellow-500", earned: true },
  { icon: Flame, label: "5-Day Streak", color: "from-orange-400 to-red-500", earned: true },
  { icon: Star, label: "Subject Star", color: "from-violet-400 to-purple-500", earned: true },
  { icon: Target, label: "Goal Crusher", color: "from-emerald-400 to-green-500", earned: true },
  { icon: Zap, label: "Quick Learner", color: "from-blue-400 to-cyan-500", earned: false },
  { icon: Award, label: "Perfect Score", color: "from-pink-400 to-rose-500", earned: false },
];

const RECENT_EXAMS = [
  { subject: "Mathematics", date: "Nov 28", score: 88, max: 100, grade: "A" },
  { subject: "Physics", date: "Nov 25", score: 75, max: 100, grade: "B+" },
  { subject: "English", date: "Nov 22", score: 92, max: 100, grade: "A+" },
  { subject: "Chemistry", date: "Nov 18", score: 68, max: 100, grade: "B" },
  { subject: "Biology", date: "Nov 15", score: 90, max: 100, grade: "A" },
];

const GOALS = [
  { label: "Improve Math to 90%", progress: 72, target: "90%" },
  { label: "Complete 10 practice sets", progress: 60, target: "10 sets" },
  { label: "Read 5 reference books", progress: 40, target: "5 books" },
];

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.firstName || "Student";

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-medium tracking-tight">
          Welcome back, <em className="italic text-brand">{firstName}</em>
        </h1>
        <p className="text-muted-foreground mt-2">Keep up the great work! Here&apos;s your progress</p>
      </motion.div>

      {/* Overall Score + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Overall Score */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
          <Card className="glass border-border/50 h-full flex items-center justify-center py-6">
            <CardContent className="p-0">
              <GrowthIndicator value={82} maxValue={100} label="Overall Score" size="lg" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stat Cards */}
        <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Exams Taken", value: 24, icon: ClipboardList, color: "from-violet-500 to-purple-600" },
            { label: "Average Score", value: 82, icon: BarChart3, suffix: "%", color: "from-blue-500 to-cyan-600" },
            { label: "Class Rank", value: 5, icon: Trophy, prefix: "#", color: "from-amber-500 to-yellow-600" },
            { label: "Improvement", value: 12, icon: TrendingUp, suffix: "%", color: "from-emerald-500 to-green-600" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>
              <Card className="glass border-border/50 hover:shadow-premium transition-all group h-full">
                <CardContent className="p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-brand/[0.07] text-brand transition-transform duration-500 group-hover:-translate-y-0.5">
                    <stat.icon className="h-4 w-4" strokeWidth={1.7} />
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-heading font-bold mt-0.5">
                    {stat.prefix}<AnimatedCounter value={stat.value} />{stat.suffix}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader><CardTitle className="text-lg font-heading">Performance vs Class Average</CardTitle></CardHeader>
            <CardContent><PerformanceTrend data={TREND_DATA} /></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader><CardTitle className="text-lg font-heading">Subject Mastery</CardTitle></CardHeader>
            <CardContent><SubjectRadar data={RADAR_DATA} /></CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="glass border-border/50">
          <CardHeader><CardTitle className="text-lg font-heading flex items-center gap-2"><Award className="h-5 w-5 text-warning" />Achievement Badges</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {BADGES.map((badge) => (
                <div key={badge.label} className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${badge.earned ? "opacity-100" : "opacity-30 grayscale"}`}>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${badge.color}`}>
                    <badge.icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">{badge.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Exams */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="lg:col-span-2">
          <Card className="glass border-border/50">
            <CardHeader><CardTitle className="text-lg font-heading">Recent Exams</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {RECENT_EXAMS.map((exam) => (
                  <div key={exam.subject + exam.date} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/30 transition-colors">
                    <div className="flex-1"><p className="text-sm font-medium">{exam.subject}</p><p className="text-xs text-muted-foreground">{exam.date}</p></div>
                    <div className="text-right"><p className="text-sm font-bold">{exam.score}/{exam.max}</p></div>
                    <Badge variant={exam.grade.startsWith("A") ? "default" : "secondary"} className={exam.grade.startsWith("A") ? "gradient-brand text-white border-0" : ""}>{exam.grade}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Goals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader><CardTitle className="text-lg font-heading flex items-center gap-2"><Target className="h-5 w-5 text-brand" />Goals</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {GOALS.map((goal) => (
                <div key={goal.label}>
                  <div className="flex justify-between mb-1"><span className="text-xs font-medium">{goal.label}</span><span className="text-xs text-muted-foreground">{goal.progress}%</span></div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
