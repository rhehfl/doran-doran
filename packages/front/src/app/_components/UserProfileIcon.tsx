"use client";

import { User } from "common";
import Image from "next/image";

export default function UserProfileIcon({ user }: { user: User }) {
  return (
    <div className="relative">
      <Image
        className="rounded-full  shadow-xl"
        src={user.profileUrl}
        alt={user.nickname}
        width={40}
        height={40}
      />
    </div>
  );
}
