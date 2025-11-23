"use client";

import { ProfileIcon } from "@/app/_components";
import Image from "next/image";
import { Suspense } from "react";

export default function Header() {
  return (
    <header className="w-full flex px-5 py-3 justify-between fixed ">
      <Image src="/logo.webp" alt="로고" width={60} height={60} />
      <div className="justify-end ">
        <Suspense
          fallback={
            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
          }
        >
          <ProfileIcon />
        </Suspense>
      </div>
    </header>
  );
}
