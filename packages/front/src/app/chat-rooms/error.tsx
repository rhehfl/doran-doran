"use client";

import Link from "next/link";

export default function ChatErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24 text-center dark:bg-gray-900 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1>인증 에러</h1>
        <p className="mt-4 text-base font-semibold text-indigo-600 dark:text-indigo-400">
          401
        </p>

        {/* 홈으로 가기 버튼 */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
