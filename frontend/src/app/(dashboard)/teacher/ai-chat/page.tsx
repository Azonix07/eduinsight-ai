"use client";

import { ChatPanel } from "@/components/chat/chat-panel";

export default function TeacherChatPage() {
  return (
    <ChatPanel
      eyebrow="AI assistant"
      title={
        <>
          Your teaching <em className="italic text-brand">assistant</em>
        </>
      }
      intro="Ask for question papers, marking schemes, remediation ideas, or help interpreting a student's results — the assistant knows the platform and the pedagogy."
      suggestions={[
        "Draft a 10-mark question on quadratic equations",
        "Write a marking rubric for an essay question",
        "How do I help a student who keeps making calculation errors?",
      ]}
    />
  );
}
