"use client";

import { Suspense } from "react";
import Image from "next/image";
import {
  ChatRoomTab,
  SuspenseHeaderProfileMenu,
} from "@/app/chat-rooms/_components";

export default function ChatHeader() {
  return (
    <header className="flex flex-col items-center w-full bg-gray-50 justify-center">
      <div className="w-full flex justify-between mt-5 px-5 lg:px-15">
        <Image src="/logo.webp" alt="로고" width={60} height={60} />
        <div className="justify-end ">
          <Suspense
            fallback={
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
            }
          >
            <SuspenseHeaderProfileMenu />
          </Suspense>
        </div>
      </div>
      <ChatRoomTab />
    </header>
  );
}
