"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { LoginContent } from "@/app/login/_components";

// Next.js에서 useSearchParams를 쓰려면 Suspense로 감싸야 안전합니다.
export default function LoginPage() {
  return (
    <SsgoiTransition id="/login">
      <LoginContent />
    </SsgoiTransition>
  );
}
