"use client";

import { useState } from "react";
import Link from "next/link";
import { UserProfileIcon } from "@/app/_components";
import { useAuth } from "@/app/_hooks";
import { useMutation } from "@tanstack/react-query";
import { userQueries } from "@/app/_queries";
import { User } from "common";
import { transition } from "@ssgoi/react";
import { slide } from "@ssgoi/react/transitions";

export default function HeaderProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: onLogout } = useMutation(userQueries.logout());
  const user = useAuth();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative z-50 p-1 ">
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center p-1 rounded-full hover:bg-gray-300 transition focus:outline-none cursor-pointer"
      >
        <UserProfileIcon user={user} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeMenu} />
          <div
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 "
            ref={transition({
              key: "profile-menu",
              ...slide({
                direction: "up",
                distance: 50,
              }),
            })}
          >
            {user.isAuthenticated ? (
              <UserMenu user={user} onLogout={onLogout} />
            ) : (
              <GuestMenu user={user} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
function UserMenu({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <UserProfileIcon user={user} />
        <div>
          <p className="font-bold text-gray-900">{user.nickname}</p>
          <p className="text-xs text-gray-500">반가워요! 👋</p>
        </div>
      </div>
      <button
        onClick={() => onLogout()}
        className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        로그아웃
      </button>
    </>
  );
}
function GuestMenu({ user }: { user: User }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <UserProfileIcon user={user} />
        <div>
          <p className="font-bold text-gray-800 text-sm">
            {user.nickname} (게스트)
          </p>
          <p className="text-[11px] text-gray-500">
            채팅 기록이 저장되지 않아요
          </p>
        </div>
      </div>
      <Link
        href={`/auth/login?redirect=/chat-rooms`}
        className="block w-full text-center bg-indigo-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
      >
        3초 만에 로그인하고 저장
      </Link>
    </>
  );
}
