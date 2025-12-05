"use client";

import { SuspenseChatRoom, SuspenseSideBar } from "@/app/chat/[id]/_components";
import { SsgoiTransition } from "@ssgoi/react";
import { Suspense } from "react";

export default function ChatPage() {
  return (
    <SsgoiTransition id="/chat/*">
      <main className="flex h-screen bg-gray-100 antialiased dark:bg-gray-900 text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <Suspense fallback={<>Loading sidebar...</>}>
            <SuspenseSideBar />
          </Suspense>
          <div className="p-0 lg:p-10 flex flex-col w-full">
            <div className="dark:bg-gray-600 dark:border dark:border-gray-500 flex flex-col h-full bg-white rounded-2xl py-10 px-4 lg:px-8">
              <Suspense fallback={<>Loading chat room...</>}>
                <SuspenseChatRoom />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </SsgoiTransition>
  );
}
