"use client";

import { ProfileIcon } from "@/app/_components";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FiMessageSquare, FiUsers } from "react-icons/fi"; // react-icons 사용
import Image from "next/image";

export default function ChatHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab =
    searchParams.get("tab") === "public" ? "public" : "private";

  const handleTabChange = (tab: "private" | "public") => {
    const params = new URLSearchParams(searchParams.toString());

    if (tab === "private") {
      params.delete("tab");
    } else {
      params.set("tab", "public");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <header className="flex flex-col items-center w-full bg-gray-50 justify-center">
      <div className="w-full flex justify-between mt-5 px-20">
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
      </div>
      <div className="min-w-full bg-gray-100 p-1.5 rounded-full flex items-center relative lg:min-w-lg">
        <button
          onClick={() => handleTabChange("private")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
            currentTab === "private"
              ? "bg-white text-[#584BF2] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiMessageSquare size={18} />
          <span>내 채팅</span>
        </button>

        <button
          onClick={() => handleTabChange("public")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
            currentTab === "public"
              ? "bg-white text-[#584BF2] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiUsers size={18} />
          <span>오픈 채팅방</span>
        </button>
      </div>
    </header>
  );
}
