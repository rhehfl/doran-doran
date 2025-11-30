import SuspenseProfileCard from "@/app/chat/[id]/_components/SuspenseProfileCard";
import { transition } from "@ssgoi/react";
import { fade } from "@ssgoi/react/transitions";
import { Suspense } from "react";

export default function EmptyChatCard() {
  return (
    <div
      className="flex items-center space-x-2"
      ref={transition({
        key: "empty-chat-card",
        ...fade(),
      })}
    >
      <div className="flex items-end mb-2">
        <Suspense
          fallback={
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
          }
        >
          <SuspenseProfileCard size="small" />
        </Suspense>
        <div className="relative max-w-lg py-5 rounded-lg bg-[#d7d9dc] animate-pulse">
          <div className="text-sm w-30" />
        </div>
      </div>
    </div>
  );
}
