"use client";

import { ERROR_CODE } from "common";
import Link from "next/link";
import { TbError404, TbLock, TbWifiOff } from "react-icons/tb";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ChatErrorPage({ error, reset }: ErrorPageProps) {
  const getErrorContent = () => {
    if (
      error.message === ERROR_CODE.UNAUTHORIZED ||
      error.message === ERROR_CODE.FORBIDDEN
    ) {
      return {
        icon: <TbLock className="mx-auto h-24 w-24 text-orange-500" />,
        code: "401 / 403",
        title: "접근 권한이 없습니다",
        desc: "로그인이 필요하거나 해당 페이지를 볼 수 있는 권한이 없습니다.",
        buttonText: "로그인 페이지로",
        buttonLink: "/login",
        action: null,
      };
    }

    // 2. 네트워크 또는 데이터 불러오기 에러
    if (error.message.includes("Network") || error.message.includes("Fetch")) {
      return {
        icon: <TbWifiOff className="mx-auto h-24 w-24 text-red-500" />,
        code: "Network Error",
        title: "연결이 불안정합니다",
        desc: "서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        buttonText: "다시 시도",
        buttonLink: null, // 링크 대신 액션 사용
        action: reset, // reset 함수 연결 (페이지 리로드 시도)
      };
    }

    // 3. 그 외 일반적인 에러 (기본값)
    return {
      icon: (
        <TbError404 className="mx-auto h-24 w-24 text-indigo-600 dark:text-indigo-400" />
      ),
      code: error.name || "Error",
      title: "오류가 발생했습니다",
      desc:
        error.message ||
        "죄송합니다. 알 수 없는 오류가 발생하여 페이지를 표시할 수 없습니다.",
      buttonText: "홈으로 돌아가기",
      buttonLink: "/",
      action: null,
    };
  };

  const content = getErrorContent();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24 text-center dark:bg-gray-900 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* 동적 아이콘 */}
        {content.icon}

        {/* 에러 코드/이름 */}
        <p className="mt-4 text-base font-semibold text-indigo-600 dark:text-indigo-400">
          {content.code}
        </p>

        {/* 메인 헤더 */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
          {content.title}
        </h1>

        {/* 설명 */}
        <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
          {content.desc}
        </p>

        {/* 버튼 영역 */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {content.action ? (
            // 리셋(다시 시도) 기능이 있는 경우 버튼
            <button
              onClick={content.action}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {content.buttonText}
            </button>
          ) : (
            // 단순 링크 이동인 경우 Link
            <Link
              href={content.buttonLink || "/"}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {content.buttonText}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
