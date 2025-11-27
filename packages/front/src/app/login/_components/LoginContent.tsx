"use client";

import { GoogleLoginButton } from "@/app/_components";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mb-4 text-3xl">
            👋
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            AI와의 대화를 저장하세요
          </h1>
          <p className="text-gray-500 text-sm">
            로그인하면 나만의 AI 페르소나와
            <br />
            주고받은 대화 내용을 영구적으로 보관할 수 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          <GoogleLoginButton />
        </div>

        {/* 구분선 */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400">
              아직 고민 중이신가요?
            </span>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="text-center">
          <Link
            href={redirectUrl} // 원래 있던 곳으로 돌아가기
            className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            로그인 없이 게스트로 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}
