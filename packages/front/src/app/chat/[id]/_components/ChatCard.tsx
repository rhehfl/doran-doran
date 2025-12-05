"use client";
import { useSuspenseAuth } from "@/app/_hooks";
import { ProfileCard } from "@/app/chat/[id]/_components";
import { transition } from "@ssgoi/react";
import { slide } from "@ssgoi/react/transitions";
import { Message } from "common";
import { memo } from "react";
import Markdown from "react-markdown";

interface ChatCardProps extends Message {
  id: number;
}

export default memo(function ChatCard({
  userId,
  author,
  id,
  content,
  senderName,
  senderProfileImage,
}: ChatCardProps) {
  const user = useSuspenseAuth();

  if (author === "Gemini") {
    return (
      <div
        className={`flex lg:items-end mb-2 lg:flex-row flex-col  lg:justify-start items-start`}
      >
        <ProfileCard
          size="small"
          profileUrl={senderProfileImage}
          name={senderName}
        />
        <div className="relative max-w-lg px-4 py-2 rounded-lg bg-[#E0E7FF] order-1">
          <div className="text-sm wrap-anywhere">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      </div>
    );
  }

  if (userId !== user?.userId) {
    return (
      <div
        ref={transition({
          key: `chat-card-${id}`,
          ...slide({
            direction: "up",
          }),
        })}
        className={`flex lg:items-end mb-2 lg:flex-row flex-col  lg:justify-start items-start`}
      >
        <ProfileCard
          size="small"
          profileUrl={senderProfileImage}
          name={senderName}
        />
        <div className="relative max-w-lg px-4 py-2 rounded-lg bg-[#E0E7FF] order-1">
          <div className="text-sm">
            <Markdown>{content}</Markdown>
            {senderName}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex lg:items-end mb-2 lg:flex-row flex-col lg:justify-end items-end`}
    >
      <ProfileCard
        size="small"
        profileUrl={senderProfileImage}
        name={senderName}
      />
      <div className="relative max-w-lg px-4 py-2 rounded-lg order-2 bg-[#E0E7FF]">
        <div className="text-sm">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  );
});
