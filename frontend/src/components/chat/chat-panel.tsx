"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowUp, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  suggestions: string[];
}

export function ChatPanel({ eyebrow, title, intro, suggestions }: ChatPanelProps) {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = useMutation({
    mutationFn: (payload: { message: string; history: ChatMessage[] }) =>
      apiClient.post<{ reply: string }>("/ai/chat", payload, { timeout: 120000 }),
    onSuccess: (res) => {
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into a problem answering that. Please try again in a moment.",
        },
      ]);
    },
  });

  const submit = (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || send.isPending) return;
    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    send.mutate({ message, history });
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, send.isPending]);

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-3xl flex-col">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <span className="eyebrow text-brand">{eyebrow}</span>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">{title}</h1>
      </motion.div>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="scrollbar-thin mt-8 flex-1 overflow-y-auto border border-border bg-card"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              {intro}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="border border-border px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-brand hover:text-brand"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] bg-foreground px-4 py-3 text-sm leading-relaxed text-background">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[92%]">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-brand">
                      EduInsight AI
                    </span>
                    <div className="mt-1.5 whitespace-pre-wrap border-l-2 border-brand/40 pl-4 text-sm leading-relaxed text-foreground/90">
                      {m.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {send.isPending && (
              <div className="flex items-center gap-2 pl-4 text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em]">
                  thinking…
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mt-4 flex items-end gap-3 border border-border bg-card p-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={`Ask anything${user?.firstName ? `, ${user.firstName}` : ""}…`}
          className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <Button
          type="submit"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-sm"
          disabled={send.isPending || !input.trim()}
          aria-label="Send"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </form>
      <p className="mt-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground/60">
        Powered by Claude · answers may need a teacher&apos;s judgement
      </p>
    </div>
  );
}
