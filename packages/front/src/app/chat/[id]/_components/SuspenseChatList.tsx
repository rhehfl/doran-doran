"use client";

import { chatRoomQueries } from "@/app/_queries";
import { ChatCard } from "@/app/chat/[id]/_components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRef } from "react";

export default function SuspenseChatList() {
  const { id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useSuspenseQuery(
    chatRoomQueries.history(Number(id)!),
  );
  console.log(messages);
  return (
    <>
      {messages.map((msg, index) => (
        <ChatCard key={index} id={index} {...msg} />
      ))}
      <div ref={messagesEndRef} />
    </>
  );
}
