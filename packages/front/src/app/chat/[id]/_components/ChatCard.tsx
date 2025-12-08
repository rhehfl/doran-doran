"use client";
import { ProfileCard } from "@/app/chat/[id]/_components";
import { transition } from "@ssgoi/react";
import { slide } from "@ssgoi/react/transitions";
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
  id,
  content,
  senderName,
  senderProfileImage,
  currentUserId,
}: ChatCardProps) {
  const safeProfileImage = senderProfileImage || "/default-profile.png";

  const isGemini = author === "Gemini";
  const isMe = userId === currentUserId;

  if (isGemini || !isMe) {
    return (
      <div
        ref={
          !isGemini
            ? transition({
                key: `chat-card-${id}`,
                ...slide({ direction: "up" }),
              })
            : undefined
        }
        className={`flex lg:items-end mb-2 lg:flex-row flex-col lg:justify-start items-start gap-2`}
      >
        <ProfileCard
          size="small"
          profileUrl={safeProfileImage} // 수정된 변수 사용
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
