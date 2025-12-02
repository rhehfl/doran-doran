"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  const handleClose = (el: React.MouseEvent<HTMLDivElement>) => {
    if (el.target !== divRef.current) return;
    router.back();
    console.log("Modal closed");
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div
      ref={divRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleClose}
    >
      {children}
    </div>
  );
}
