"use client";

import {
  ProfileCard,
  RoomVisibilityToggle,
} from "@/app/chat/[id]/_components/";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IoChatboxEllipses } from "react-icons/io5";
import { chatRoomQueries } from "@/app/_queries";
import { useParams } from "next/navigation";
import { useSuspenseAuth } from "@/app/_hooks";

export default function SuspenseSideBar() {
  const { id } = useParams();
  const { data: roomInfo } = useSuspenseQuery(
    chatRoomQueries.detail(Number(id)),
  );
  const user = useSuspenseAuth();

  return (
    <>
      <div className="dark:bg-gray-800 dark:border dark:border-r-2 dark:border-gray-700 flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0 hidden md:flex">
        <div className="flex flex-row items-center justify-center h-12 w-full">
          <div className="flex items-center justify-center rounded-2xl bg-indigo-100 dark:bg-white h-10 w-10">
            <IoChatboxEllipses />
          </div>
          <div className="ml-2 font-bold text-2xl dark:text-white">채팅방</div>
        </div>
        <ProfileCard
          size="large"
          name={roomInfo.persona.name}
          profileUrl={roomInfo.persona.image}
        />
        {user.userId === roomInfo.userId && (
          <div className="w-full flex items-center mt-3 flex-col">
            <span>채팅방 {roomInfo.isPublic ? "공개" : "비공개"}</span>
            <RoomVisibilityToggle
              defaultChecked={roomInfo.isPublic}
              roomId={roomInfo.id}
            />
          </div>
        )}
      </div>
    </>
  );
}
