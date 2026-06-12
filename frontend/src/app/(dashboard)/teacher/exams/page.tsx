"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowUpRight, FileText } from "lucide-react";
import { apiClient } from "@/lib/api";
import type { Exam } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ExamListResponse {
  exams: Exam[];
  total: number;
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  active: "Active",
  completed: "Completed",
  evaluated: "Evaluated",
};

export default function TeacherExamsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["exams"],
    queryFn: () => apiClient.get<ExamListResponse>("/exams", { limit: 50 }),
  });

  const exams = data?.data?.exams ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <span className="eyebrow text-brand">Grading studio</span>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
          Exams &amp; <em className="italic text-brand">grading</em>
        </h1>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          Pick an exam, upload scanned answer sheets, and let the AI read and grade
          every answer against your marking scheme.
        </p>
      </motion.div>

      <div className="mt-10 border border-border bg-card">
        {isLoading && (
          <div className="space-y-px p-6">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        )}

        {isError && (
          <p className="p-8 text-sm text-muted-foreground">
            Could not load exams — is the API running?
          </p>
        )}

        {!isLoading && !isError && exams.length === 0 && (
          <div className="p-10 text-center">
            <FileText className="mx-auto h-6 w-6 text-muted-foreground/50" strokeWidth={1.5} />
            <p className="mt-4 text-sm text-muted-foreground">
              No exams yet. Seed the demo data or create an exam via the API.
            </p>
          </div>
        )}

        {exams.map((exam, i) => (
          <Link
            key={exam._id}
            href={`/teacher/exams/${exam._id}`}
            className="group flex items-baseline gap-4 border-b border-border px-6 py-5 transition-colors last:border-0 hover:bg-accent/40 sm:gap-6"
          >
            <span className="font-mono text-[0.65rem] text-brand">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-display text-lg font-medium tracking-tight transition-colors group-hover:text-brand">
                {exam.name}
              </h2>
              <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                {exam.subject?.name ?? "—"} · Grade {exam.grade}
                {exam.section ? `-${exam.section}` : ""} · {STATUS_LABEL[exam.status] ?? exam.status}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <div className="font-mono text-sm tabular">{exam.maxMarks} marks</div>
              <div className="mt-1 font-mono text-[0.65rem] text-muted-foreground">
                {exam.totalAnswerSheets} sheet{exam.totalAnswerSheets === 1 ? "" : "s"}
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 self-center text-brand opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}
