"use client";

import { useLocalStorage } from "@/app/_hooks";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SaveCurrentPathToLocalStorage() {
  const path = usePathname();
  const [, setRedirectPath] = useLocalStorage({
    key: "redirectPath",
    initialValue: "/",
  });
  useEffect(() => {
    console.log("Saving current path to localStorage:", path);
    setRedirectPath(path);
  }, []);
  return null;
}
