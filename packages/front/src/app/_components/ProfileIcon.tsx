"use client";

import { useAuth } from "@/app/_hooks";
import Image from "next/image";

export default function ProfileIcon() {
  const user = useAuth();

  return (
    <div className="relative">
      <button className="cursor-pointer p-1 rounded-full ">
        <Image
          className="rounded-full  shadow-xl"
          src={user.profileUrl}
          alt={user.nickname}
          width={40}
          height={40}
        />
      </button>
    </div>
  );
}
