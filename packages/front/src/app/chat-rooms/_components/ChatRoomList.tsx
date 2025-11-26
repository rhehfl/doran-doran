"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChatRoomCard } from "@/app/chat-rooms/_components";
import { chatRoomQueries } from "@/app/_queries";
import { useSearchParams } from "next/navigation";

export default function ChatRoomList() {
  const searchParams = useSearchParams();

  const currentTab =
    searchParams.get("tab") === "public" ? "public" : "private";

  const { data: chatRoomList } = useSuspenseQuery(chatRoomQueries.myList());
  const { data: publicChatRoomList } = useSuspenseQuery(
    chatRoomQueries.publicList(),
  );

  if (chatRoomList.length === 0) {
    return (
      <p className="text-center text-gray-500">참여중인 채팅방이 없습니다.</p>
    );
  }
  if (currentTab === "public") {
    return (
      <ul className="flex flex-col gap-5">
        {publicChatRoomList.map((chat) => (
          <ChatRoomCard key={chat.id} {...chat} />
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {chatRoomList.map((chat) => (
        <ChatRoomCard key={chat.id} {...chat} />
      ))}
    </ul>
  );
}
