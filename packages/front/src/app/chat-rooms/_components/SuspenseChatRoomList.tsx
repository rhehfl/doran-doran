"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChatRoomCard } from "@/app/chat-rooms/_components";
import { chatRoomQueries } from "@/app/_queries";
import { useSearchParams } from "next/navigation";
import PublicChatRoomCard from "@/app/chat-rooms/_components/PublicChatRoomCard";
import { transition } from "@ssgoi/react";
import { fade } from "@ssgoi/react/transitions";

export default function SuspenseChatRoomList() {
  const searchParams = useSearchParams();

  const currentTab =
    searchParams.get("tab") === "public" ? "public" : "private";

  const { data: chatRoomList } = useSuspenseQuery(chatRoomQueries.myList());
  const { data: publicChatRoomList } = useSuspenseQuery(
    chatRoomQueries.publicList(),
  );

  if (currentTab === "public") {
    if (publicChatRoomList.length === 0) {
      return (
        <p
          className="text-center text-gray-500"
          ref={transition({
            key: "public-chatroom-empty",
            ...fade(),
          })}
        >
          공개된 채팅방이 없습니다.
        </p>
      );
    }

    return (
      <ul
        className="flex flex-col gap-5"
        ref={transition({
          key: "public-chatroom-list",
          ...fade(),
        })}
      >
        {publicChatRoomList.map((chat) => (
          <PublicChatRoomCard key={chat.id} {...chat} />
        ))}
      </ul>
    );
  }
  if (chatRoomList.length === 0) {
    return (
      <p
        className="text-center text-gray-500"
        ref={transition({
          key: "private-chatroom-empty",
          ...fade(),
        })}
      >
        참여중인 채팅방이 없습니다.
      </p>
    );
  }

  return (
    <ul
      className="flex flex-col gap-5"
      ref={transition({
        key: "private-chatroom-list",
        ...fade(),
      })}
    >
      {chatRoomList.map((chat) => (
        <ChatRoomCard key={chat.id} {...chat} />
      ))}
    </ul>
  );
}
