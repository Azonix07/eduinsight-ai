"use client";

import { motion } from "motion/react";
import { TrendingUp, BarChart3, Trophy, Calendar, AlertTriangle, Heart, BookOpen, Download, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/charts/animated-counter";
import { PerformanceTrend } from "@/components/charts/performance-trend";
import { SubjectRadar } from "@/components/charts/subject-radar";
import { GrowthIndicator } from "@/components/charts/growth-indicator";

const TREND_DATA = [
  { date: "Jan", score: 72, average: 70 }, { date: "Feb", score: 75, average: 71 },
  { date: "Mar", score: 73, average: 72 }, { date: "Apr", score: 78, average: 73 },
  { date: "May", score: 80, average: 74 }, { date: "Jun", score: 82, average: 73 },
  { date: "Jul", score: 79, average: 75 }, { date: "Aug", score: 85, average: 76 },
];

const RADAR_DATA = [
  { subject: "Math", score: 78, fullMark: 100 }, { subject: "Physics", score: 72, fullMark: 100 },
  { subject: "Chemistry", score: 65, fullMark: 100 }, { subject: "Biology", score: 88, fullMark: 100 },
  { subject: "English", score: 85, fullMark: 100 }, { subject: "Social", score: 70, fullMark: 100 },
];

const CONCERNS = [
  { subject: "Chemistry", issue: "Struggling with organic chemistry concepts", severity: "high" },
  { subject: "Physics", issue: "Weak in numerical problem-solving", severity: "medium" },
];

const SUGGESTIONS = [
  { title: "Practice Math Daily", desc: "15 minutes of practice problems can improve Math scores by 10%.", icon: BookOpen },
  { title: "Review Chemistry Notes", desc: "Help review organic chemistry chapters 5-8 together.", icon: Heart },
  { title: "Encourage Reading", desc: "Reading 20 mins/day can improve English comprehension significantly.", icon: BookOpen },
];

export default function ParentDashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold">
          <span className="text-gradient">Alex&apos;s</span> Progress Report
        </h1>
        <p className="text-muted-foreground mt-1">Class 10-A · Lincoln Academy</p>
      </motion.div>

      {/* Score + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="glass border-border/50 h-full flex items-center justify-center py-6">
            <CardContent className="p-0"><GrowthIndicator value={78} maxValue={100} label="Overall Performance" size="lg" /></CardContent>
          </Card>
        </motion.div>
        <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Average Score", value: 78, icon: BarChart3, suffix: "%", color: "from-violet-500 to-purple-600" },
            { label: "Class Rank", value: 12, icon: Trophy, prefix: "#", color: "from-amber-500 to-yellow-600" },
            { label: "Attendance", value: 94, icon: Calendar, suffix: "%", color: "from-blue-500 to-cyan-600" },
            { label: "Improvement", value: 8, icon: TrendingUp, suffix: "%", color: "from-emerald-500 to-green-600" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>
              <Card className="glass border-border/50 hover:shadow-premium transition-all group h-full">
                <CardContent className="p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-brand/[0.07] text-brand transition-transform duration-500 group-hover:-translate-y-0.5">
                    <stat.icon className="h-4 w-4" strokeWidth={1.7} />
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-heading font-bold mt-0.5">{stat.prefix}<AnimatedCounter value={stat.value} />{stat.suffix}</p>
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
            <CardHeader><CardTitle className="text-lg font-heading">Performance Trend</CardTitle></CardHeader>
            <CardContent><PerformanceTrend data={TREND_DATA} /></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader><CardTitle className="text-lg font-heading">Subject Performance</CardTitle></CardHeader>
            <CardContent><SubjectRadar data={RADAR_DATA} /></CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Concerns */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader><CardTitle className="text-lg font-heading flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" />Areas of Concern</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {CONCERNS.map((c) => (
                <div key={c.subject} className={`p-3 rounded-xl border ${c.severity === "high" ? "border-destructive/30 bg-destructive/5" : "border-warning/30 bg-warning/5"}`}>
                  <p className="text-sm font-semibold">{c.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.issue}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Suggestions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="glass border-border/50 h-full">
            <CardHeader><CardTitle className="text-lg font-heading flex items-center gap-2"><Heart className="h-5 w-5 text-rose-500" />How You Can Help</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {SUGGESTIONS.map((s) => (
                <div key={s.title} className="p-3 rounded-xl bg-accent/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-1"><s.icon className="h-4 w-4 text-brand" /><span className="text-xs font-semibold">{s.title}</span></div>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <div className="flex flex-wrap gap-3">
          <Button className="gradient-brand text-white border-0 hover:opacity-90"><Download className="h-4 w-4 mr-2" />Download Report Card</Button>
          <Button variant="outline"><MessageSquare className="h-4 w-4 mr-2" />Talk to Teacher</Button>
          <Button variant="outline"><BarChart3 className="h-4 w-4 mr-2" />View Full Analytics</Button>
        </div>
      </motion.div>
    </div>
  );
}
