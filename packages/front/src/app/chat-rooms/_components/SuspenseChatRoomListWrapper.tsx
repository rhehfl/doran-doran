"use client";
import dynamic from "next/dynamic";
const SuspenseChatRoomList = dynamic(
  () => import("@/app/chat-rooms/_components/SuspenseChatRoomList"),
  { ssr: false },
);
import { Suspense } from "react";

export default function SuspenseChatRoomListWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="h-70 overflow-auto p-4">
        <SuspenseChatRoomList />
      </section>
    </Suspense>
  );
}
