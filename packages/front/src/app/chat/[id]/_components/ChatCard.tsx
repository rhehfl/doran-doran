"use client";
import { UserProfileIcon } from "@/app/_components";
import { ProfileCard } from "@/app/chat/[id]/_components";
import { Message } from "common";
import { memo } from "react";
import Markdown from "react-markdown";

interface ChatCardProps extends Message {
  id: number;
  currentUserId: string;
}

export default memo(function ChatCard({
  userId,
  author,
  content,
  senderName,
  senderProfileImage,
  currentUserId,
}: ChatCardProps) {
  const isGemini = author === "Gemini";
  const isMe = userId === currentUserId;

  if (isGemini) {
    return (
      <div
        className={`flex lg:items-end mb-2 lg:flex-row flex-col lg:justify-start items-start gap-2`}
      >
        <ProfileCard
          size="small"
          profileUrl={senderProfileImage}
          name={senderName}
        />
        <div className="relative max-w-lg px-4 py-2 rounded-lg bg-[#E0E7FF]">
          <div className="text-sm wrap-anywhere">
            <Markdown>{content}</Markdown>
          </div>
          {!isGemini && (
            <span className="text-xs text-gray-500 block mt-1">
              {senderName}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (!isMe) {
    return (
      <div
        className={`flex lg:items-end mb-2 lg:flex-row flex-col lg:justify-start items-start gap-2`}
      >
        <div className="flex flex-col min-w-15 items-center space-y-2 mr-2">
          <UserProfileIcon
            user={{
              nickname: senderName,
              profileUrl: senderProfileImage,
              isAuthenticated: true,
              userId: userId,
            }}
          />
          <span className="text-xs text-gray-500 break-words max-w-[50px] text-center dark:text-white">
            {senderName}
          </span>
        </div>
        <div className="relative max-w-lg px-4 py-2 rounded-lg bg-[#e9fff7]">
          <div className="text-sm wrap-anywhere">
            <Markdown>{content}</Markdown>
          </div>
          {!isGemini && (
            <span className="text-xs text-gray-500 block mt-1">
              {senderName}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex lg:items-end mb-2 lg:flex-row flex-col lg:justify-end items-end gap-2`}
    >
      <div className="relative max-w-lg px-4 py-2 rounded-lg bg-yellow-100">
        <div className="text-sm">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  );
});
