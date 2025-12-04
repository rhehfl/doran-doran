"use client";

import { useSuspenseAuth } from "@/app/_hooks";
import {
  ChatSendForm,
  AILoadingMessage,
  EmptyChatCard,
  SuspenseChatList,
} from "@/app/chat/[id]/_components";
import {
  useChat,
  useChatHistoryUpdater,
  useTypingEffect,
} from "@/app/chat/[id]/_hooks";
import { Message } from "common";
import { useParams } from "next/navigation";
import { Suspense, useRef } from "react";

export default function SuspenseChatRoom() {
  const user = useSuspenseAuth();
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { displayedText, addChunk, setText, reset } = useTypingEffect();
  const { historyUpdater } = useChatHistoryUpdater(Number(id));
  const { isAiThinking, sendMessage } = useChat(user, Number(id), {
    onStream: (chunk: string) => addChunk(chunk),
    onStreamError: (message: string) => {
      setText(`[오류 발생] ${message}`);
      reset();
    },
    onStreamDone: (fullText: string) => {
      const finalAiMessage: Message = {
        author: "Gemini",
        content: fullText,
        senderName: user.nickname,
        userId: user?.userId || "",
      };
      historyUpdater(finalAiMessage);
      reset();
    },
    onMessage: (message: Message) => {
      historyUpdater(message);
    },
  });

  return (
    <>
      <div className="px-4 flex-grow overflow-y-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <SuspenseChatList />
        </Suspense>
        {isAiThinking && !displayedText && <EmptyChatCard />}
        {displayedText && <AILoadingMessage streamingMessage={displayedText} />}
        <div ref={messagesEndRef} />
      </div>
      <ChatSendForm onSubmit={sendMessage} messageRef={messagesEndRef} />
    </>
  );
}
