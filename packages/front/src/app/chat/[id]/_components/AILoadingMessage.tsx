"use client";
import { SuspenseProfileCard } from "@/app/chat/[id]/_components";
import { Suspense } from "react";
import Markdown from "react-markdown";

interface AILoadingMessageProps {
  streamingMessage: string;
}
export default function AILoadingMessage({
  streamingMessage,
}: AILoadingMessageProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-end mb-2">
        <Suspense
          fallback={
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
          }
        >
          <SuspenseProfileCard size="small" />
        </Suspense>
        <div className="relative max-w-lg px-4 py-2 rounded-lg bg-[#F3F4F6]">
          <div className="text-sm">
            <Markdown>{streamingMessage}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}
