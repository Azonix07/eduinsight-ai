"use client";

import { useEffect, useState } from "react";

interface GrowthIndicatorProps {
  value: number;
  maxValue: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { width: 80, stroke: 6, fontSize: "text-lg", labelSize: "text-[10px]" },
  md: { width: 120, stroke: 8, fontSize: "text-2xl", labelSize: "text-xs" },
  lg: { width: 160, stroke: 10, fontSize: "text-3xl", labelSize: "text-sm" },
};

export function GrowthIndicator({ value, maxValue, label, size = "md" }: GrowthIndicatorProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const config = SIZES[size];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (animatedValue / maxValue) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg className="-rotate-90" width={config.width} height={config.width}>
          <defs>
            <linearGradient id={`gauge-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.55 0.22 270)" />
              <stop offset="100%" stopColor="oklch(0.6 0.22 300)" />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.5 0 0 / 0.08)"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={`url(#gauge-gradient-${label})`}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${config.fontSize} font-heading font-bold`}>
            {Math.round(percentage)}
          </span>
          <span className={`${config.labelSize} text-muted-foreground -mt-0.5`}>%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}
