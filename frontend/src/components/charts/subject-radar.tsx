"use client";

import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

interface SubjectRadarProps {
  data: { subject: string; score: number; fullMark: number }[];
}

export function SubjectRadar({ data }: SubjectRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} stroke="var(--border)" />
        <Radar
          name="Score"
          dataKey="score"
          stroke="var(--brand)"
          fill="var(--brand)"
          fillOpacity={0.16}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
