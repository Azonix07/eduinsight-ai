"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface PerformanceTrendProps {
  data: { date: string; score: number; average?: number }[];
}

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "4px",
  boxShadow: "0 8px 20px -14px oklch(0 0 0 / 0.25)",
  fontSize: "13px",
  color: "var(--foreground)",
} as const;

export function PerformanceTrend({ data }: PerformanceTrendProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} stroke="var(--border)" />
        <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} stroke="var(--border)" domain={[0, 100]} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="score"
          name="Score"
          stroke="var(--brand)"
          strokeWidth={2.5}
          dot={{ r: 3.5, fill: "var(--brand)", strokeWidth: 0 }}
          activeDot={{ r: 5.5, strokeWidth: 2 }}
        />
        {data.some((d) => d.average !== undefined) && (
          <Line
            type="monotone"
            dataKey="average"
            name="Class Average"
            stroke="var(--muted-foreground)"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
