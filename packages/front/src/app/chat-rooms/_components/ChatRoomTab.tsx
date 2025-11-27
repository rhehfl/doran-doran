"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiMessageSquare, FiUsers } from "react-icons/fi";

export default function ChatRoomTab() {
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
    <div className="min-w-full px-4 bg-gray-100 p-1.5 rounded-full flex items-center relative lg:min-w-lg">
      <button
        onClick={() => handleTabChange("private")}
        className={`flex-1 flex cursor-pointer items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
          currentTab === "private"
            ? "bg-white text-[#584BF2] shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-300"
        }`}
      >
        <FiMessageSquare size={18} />
        <span>내 채팅</span>
      </button>

      <button
        onClick={() => handleTabChange("public")}
        className={`flex-1 flex items-center cursor-pointer justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
          currentTab === "public"
            ? "bg-white text-[#584BF2] shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-300"
        }`}
      >
        <FiUsers size={18} />
        <span>오픈 채팅방</span>
      </button>
    </div>
  );
}
