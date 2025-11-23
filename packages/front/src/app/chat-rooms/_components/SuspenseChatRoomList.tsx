"use client";
import dynamic from "next/dynamic";
const ChatRoomList = dynamic(
  () => import("@/app/chat-rooms/_components/ChatRoomList"),
  { ssr: false },
);
import { Suspense } from "react";

export default function SuspenseChatRoomList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatRoomList />
    </Suspense>
  );
}
