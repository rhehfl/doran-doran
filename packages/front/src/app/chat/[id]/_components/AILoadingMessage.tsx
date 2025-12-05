"use client";
import { ProfileCard } from "@/app/chat/[id]/_components";
import { Suspense } from "react";
import Markdown from "react-markdown";

interface AILoadingMessageProps {
  streamingMessage: string;
  name: string;
  profileUrl: string;
}
export default function AILoadingMessage({
  streamingMessage,
  name,
  profileUrl,
}: AILoadingMessageProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-end mb-2">
        <Suspense
          fallback={
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
          }
        >
          <ProfileCard size="small" name={name} profileUrl={profileUrl} />
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
