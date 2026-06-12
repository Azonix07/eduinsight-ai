"use client";

import { motion } from "motion/react";
import { Building2, Users, Activity, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/charts/animated-counter";
import { PerformanceTrend } from "@/components/charts/performance-trend";

const TREND_DATA = [
  { date: "Jan", score: 340 }, { date: "Feb", score: 420 }, { date: "Mar", score: 510 },
  { date: "Apr", score: 580 }, { date: "May", score: 650 }, { date: "Jun", score: 720 },
  { date: "Jul", score: 780 }, { date: "Aug", score: 860 }, { date: "Sep", score: 950 },
  { date: "Oct", score: 1020 }, { date: "Nov", score: 1150 }, { date: "Dec", score: 1280 },
];

const SCHOOLS = [
  { name: "Lincoln Academy", students: 1248, score: 82, status: "active" },
  { name: "Westfield High", students: 980, score: 78, status: "active" },
  { name: "Global International", students: 2100, score: 85, status: "active" },
  { name: "Cambridge Prep", students: 650, score: 88, status: "trial" },
  { name: "Stanford Academy", students: 1500, score: 80, status: "active" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold">
          <span className="text-gradient">Platform</span> Overview
        </h1>
        <p className="text-muted-foreground mt-1">System-wide analytics and management</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Schools", value: 524, icon: Building2, color: "from-violet-500 to-purple-600" },
          { label: "Total Users", value: 12840, icon: Users, color: "from-blue-500 to-cyan-600" },
          { label: "Active Sessions", value: 1832, icon: Activity, color: "from-emerald-500 to-green-600" },
          { label: "System Health", value: 99.9, icon: Server, suffix: "%", decimals: 1, color: "from-amber-500 to-yellow-600" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass border-border/50 hover:shadow-premium transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-heading font-bold mt-1">
                      <AnimatedCounter value={stat.value} decimals={stat.decimals || 0} />{stat.suffix}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-brand/[0.07] text-brand transition-transform duration-500 group-hover:-translate-y-0.5">
                    <stat.icon className="h-5 w-5" strokeWidth={1.7} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* User Growth */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="glass border-border/50">
          <CardHeader><CardTitle className="text-lg font-heading">User Growth</CardTitle></CardHeader>
          <CardContent><PerformanceTrend data={TREND_DATA} /></CardContent>
        </Card>
      </motion.div>

      {/* Schools Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="glass border-border/50">
          <CardHeader><CardTitle className="text-lg font-heading">Schools Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {SCHOOLS.map((school) => (
                <div key={school.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/30 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-brand text-white text-sm font-bold">{school.name[0]}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium">{school.name}</p><p className="text-xs text-muted-foreground">{school.students} students</p></div>
                  <div className="text-right mr-2"><p className="text-sm font-bold">{school.score}%</p><p className="text-xs text-muted-foreground">avg</p></div>
                  <Badge variant={school.status === "active" ? "default" : "secondary"} className={school.status === "active" ? "gradient-brand text-white border-0" : ""}>{school.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
