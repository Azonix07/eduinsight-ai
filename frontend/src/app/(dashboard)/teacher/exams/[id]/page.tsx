"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, Loader2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import type { AnswerSheet, Exam, Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface SheetListResponse {
  sheets: AnswerSheet[];
  total: number;
}
interface StudentListResponse {
  students: Student[];
  total: number;
}

/* ─── Per-question result row with inline override ────────── */

function ResultRow({
  sheetId,
  q,
  onSaved,
}: {
  sheetId: string;
  q: AnswerSheet["evaluation"]["questionResults"][number];
  onSaved: () => void;
}) {
  const [marks, setMarks] = useState<string>(String(q.marksAwarded));
  const changed = Number(marks) !== q.marksAwarded;

  const override = useMutation({
    mutationFn: () =>
      apiClient.patch(`/answer-sheets/${sheetId}/override`, {
        questionNumber: q.questionNumber,
        marksAwarded: Number(marks),
        reason: "Teacher adjustment",
      }),
    onSuccess: () => {
      toast.success(`Q${q.questionNumber} updated`);
      onSaved();
    },
    onError: () => toast.error("Could not save the override"),
  });

  return (
    <div className="border-b border-border px-5 py-4 last:border-0">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[0.65rem] text-brand">
          Q{q.questionNumber}.
        </span>
        <div className="flex flex-1 items-baseline justify-between gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={q.maxMarks}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="h-7 w-16 rounded-sm border-border px-2 text-right font-mono text-sm"
            />
            <span className="font-mono text-[0.7rem] text-muted-foreground">/ {q.maxMarks}</span>
            {changed && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 rounded-sm px-2 text-xs"
                disabled={override.isPending}
                onClick={() => override.mutate()}
              >
                {override.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
            )}
          </div>
          {q.isOverridden && (
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-warning">
              adjusted
            </span>
          )}
        </div>
      </div>
      {q.feedback && (
        <p className="mt-2.5 text-pretty text-sm leading-relaxed text-foreground/85">{q.feedback}</p>
      )}
      {q.improvementSuggestion && (
        <p className="accent-serif mt-1.5 text-[0.85rem] text-brand">{q.improvementSuggestion}</p>
      )}
      {q.errors?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {q.errors.map((e, i) => (
            <span
              key={i}
              className="border border-border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground"
              title={e.description}
            >
              {e.type}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */

export default function GradingStudioPage() {
  const { id: examId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [studentId, setStudentId] = useState("");
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [gradingId, setGradingId] = useState<string | null>(null);

  const examQ = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => apiClient.get<Exam>(`/exams/${examId}`),
  });
  const sheetsQ = useQuery({
    queryKey: ["sheets", examId],
    queryFn: () => apiClient.get<SheetListResponse>("/answer-sheets", { exam: examId }),
  });
  const studentsQ = useQuery({
    queryKey: ["students"],
    queryFn: () => apiClient.get<StudentListResponse>("/students", { limit: 100 }),
  });

  const exam = examQ.data?.data;
  const sheets = sheetsQ.data?.data?.sheets ?? [];
  const students = studentsQ.data?.data?.students ?? [];
  const selectedSheet = sheets.find((s) => s._id === selectedSheetId) ?? sheets[0] ?? null;

  const refreshSheets = () => queryClient.invalidateQueries({ queryKey: ["sheets", examId] });

  const upload = useMutation({
    mutationFn: async () => {
      const files = fileRef.current?.files;
      if (!files?.length) throw new Error("Choose at least one image of the answer sheet");
      if (!studentId) throw new Error("Choose the student this sheet belongs to");
      const fd = new FormData();
      fd.append("examId", examId);
      fd.append("studentId", studentId);
      Array.from(files).forEach((f) => fd.append("files", f));
      return apiClient.upload<AnswerSheet>("/answer-sheets/upload", fd);
    },
    onSuccess: (res) => {
      toast.success("Sheet uploaded", {
        description: `AI read ${res.data.ocrResult?.structuredContent?.length ?? 0} answer(s) from the scan.`,
      });
      if (fileRef.current) fileRef.current.value = "";
      setSelectedSheetId(res.data._id);
      refreshSheets();
    },
    onError: (e) =>
      toast.error("Upload failed", { description: e instanceof Error ? e.message : undefined }),
  });

  const evaluate = useMutation({
    mutationFn: (sheetId: string) =>
      apiClient.post<AnswerSheet>(`/answer-sheets/${sheetId}/evaluate`, undefined, {
        timeout: 240000, // two sequential Opus calls — give it room
      }),
    onMutate: (sheetId) => setGradingId(sheetId),
    onSettled: () => setGradingId(null),
    onSuccess: (res) => {
      const ev = res.data.evaluation;
      toast.success(`Graded ${ev.totalMarks}/${ev.maxMarks} (${ev.grade})`);
      setSelectedSheetId(res.data._id);
      refreshSheets();
    },
    onError: () => toast.error("Grading failed", { description: "Check the API logs and try again." }),
  });

  const evaluation = selectedSheet?.evaluation;
  const graded = evaluation?.status === "completed";

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/teacher/exams"
        className="link-underline inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All exams
      </Link>

      {/* Exam header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
        {examQ.isLoading ? (
          <Skeleton className="h-10 w-2/3" />
        ) : (
          <>
            <span className="eyebrow text-brand">Grading studio</span>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">{exam?.name}</h1>
            <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
              {exam?.subject?.name} · Grade {exam?.grade}
              {exam?.section ? `-${exam.section}` : ""} · {exam?.maxMarks} marks · pass at{" "}
              {exam?.passingMarks}
            </p>
          </>
        )}
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* ── Left: upload + sheets ── */}
        <div className="space-y-8 lg:col-span-5">
          {/* Upload */}
          <div className="border border-border bg-card p-6">
            <h2 className="eyebrow text-muted-foreground">Upload an answer sheet</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Student
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="mt-2 h-10 w-full rounded-sm border border-border bg-background px-3 text-sm"
                >
                  <option value="">Choose a student…</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.user?.firstName
                        ? `${s.user.firstName} ${s.user.lastName} — ${s.rollNumber}`
                        : s.rollNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Scanned pages (JPEG / PNG / WebP)
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="mt-2 block w-full cursor-pointer border border-dashed border-border bg-background p-4 text-sm text-muted-foreground file:mr-3 file:rounded-sm file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-xs file:text-background"
                />
              </div>
              <Button
                className="h-10 w-full rounded-sm"
                disabled={upload.isPending}
                onClick={() => upload.mutate()}
              >
                {upload.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reading handwriting…
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Upload &amp; read with AI
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sheets */}
          <div className="border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <h2 className="eyebrow text-muted-foreground">
                Answer sheets ({sheets.length})
              </h2>
            </div>
            {sheetsQ.isLoading && <Skeleton className="m-5 h-12" />}
            {!sheetsQ.isLoading && sheets.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                Nothing uploaded yet.
              </p>
            )}
            {sheets.map((sheet) => {
              const isSelected = selectedSheet?._id === sheet._id;
              const isGraded = sheet.evaluation?.status === "completed";
              const isGrading = gradingId === sheet._id;
              return (
                <button
                  key={sheet._id}
                  onClick={() => setSelectedSheetId(sheet._id)}
                  className={`flex w-full items-center gap-3 border-b border-border px-5 py-4 text-left transition-colors last:border-0 ${
                    isSelected ? "bg-accent/50" : "hover:bg-accent/30"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">
                      {sheet.student?.rollNumber ?? "Unknown student"}
                    </div>
                    <div className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {sheet.ocrResult?.structuredContent?.length ?? 0} answers read ·{" "}
                      {isGraded ? `${sheet.evaluation.totalMarks}/${sheet.evaluation.maxMarks}` : "ungraded"}
                    </div>
                  </div>
                  {isGraded ? (
                    <span className="font-display text-lg font-medium text-brand">
                      {sheet.evaluation.grade}
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-sm px-3 text-xs"
                      disabled={isGrading || evaluate.isPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        evaluate.mutate(sheet._id);
                      }}
                    >
                      {isGrading ? (
                        <>
                          <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> Grading…
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-1.5 h-3 w-3" /> Grade with AI
                        </>
                      )}
                    </Button>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: results ── */}
        <div className="lg:col-span-7">
          {!selectedSheet && (
            <div className="flex h-full min-h-64 items-center justify-center border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                Upload a sheet, then grade it to see results here.
              </p>
            </div>
          )}

          {selectedSheet && !graded && (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 border border-dashed border-border p-10 text-center">
              {gradingId === selectedSheet._id ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-brand" />
                  <div>
                    <p className="font-display text-lg font-medium">Claude is grading…</p>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                      Each answer is being marked against your scheme, with written
                      feedback. This usually takes under a minute.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-display text-lg font-medium">
                    {selectedSheet.ocrResult?.structuredContent?.length ?? 0} answers read, not yet graded
                  </p>
                  <Button
                    className="rounded-sm"
                    disabled={evaluate.isPending}
                    onClick={() => evaluate.mutate(selectedSheet._id)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Grade with AI
                  </Button>
                </>
              )}
            </div>
          )}

          {selectedSheet && graded && evaluation && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              {/* Score header */}
              <div className="flex items-end justify-between border border-border bg-card p-6">
                <div>
                  <span className="eyebrow text-muted-foreground">Result</span>
                  <div className="mt-2 font-display text-5xl font-medium tracking-tight">
                    {evaluation.totalMarks}
                    <span className="text-2xl text-muted-foreground">/{evaluation.maxMarks}</span>
                  </div>
                  <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {evaluation.percentage}% · graded by Claude, reviewable below
                  </p>
                </div>
                <div className="flex h-20 w-20 rotate-6 items-center justify-center rounded-full border-2 border-brand">
                  <span className="font-display text-3xl font-semibold text-brand">
                    {evaluation.grade}
                  </span>
                </div>
              </div>

              {/* Per-question */}
              <div className="mt-6 border border-border bg-card">
                <div className="border-b border-border px-5 py-3">
                  <h2 className="eyebrow text-muted-foreground">Question by question</h2>
                </div>
                {evaluation.questionResults.map((q) => (
                  <ResultRow
                    key={`${selectedSheet._id}-${q.questionNumber}-${q.marksAwarded}`}
                    sheetId={selectedSheet._id}
                    q={q}
                    onSaved={refreshSheets}
                  />
                ))}
              </div>

              {/* Analysis */}
              {(selectedSheet.analysis?.strengths?.length > 0 ||
                selectedSheet.analysis?.weaknesses?.length > 0) && (
                <div className="mt-6 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
                  <div className="bg-card p-5">
                    <h3 className="eyebrow text-success">Strengths</h3>
                    <ul className="mt-3 space-y-2">
                      {selectedSheet.analysis.strengths.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm text-foreground/85">
                          <span className="text-success">—</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-card p-5">
                    <h3 className="eyebrow text-warning">Focus areas</h3>
                    <ul className="mt-3 space-y-2">
                      {selectedSheet.analysis.weaknesses.map((w, i) => (
                        <li key={i} className="flex gap-2 text-sm text-foreground/85">
                          <span className="text-warning">—</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
