"use client";

import { ChatPanel } from "@/components/chat/chat-panel";

export default function StudentChatPage() {
  return (
    <ChatPanel
      eyebrow="AI tutor"
      title={
        <>
          Your personal <em className="italic text-brand">tutor</em>
        </>
      }
      intro="Stuck on a topic? Ask for an explanation, a worked example, practice questions, or a study plan — your tutor is patient and available all night before the exam."
      suggestions={[
        "Explain quadratic equations with a simple example",
        "Give me 3 practice questions on trigonometry",
        "Make me a one-week revision plan for maths",
      ]}
    />
  );
}
