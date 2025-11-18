"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let redirectPath = "/";
    try {
      const item = localStorage.getItem("redirectPath");
      redirectPath = item ? JSON.parse(item) : "/";
    } catch (error) {
      console.error("Failed to parse redirectPath:", error);
      redirectPath = "/";
    }

    router.replace(redirectPath);

    localStorage.removeItem("redirectPath");
  }, []);
  return <div>로그인 중...</div>;
}
