"use client";

import { externalApi } from "@/app/_libs";

export const postLogout = async () => {
  const res = await externalApi
    .post(`api/auth/logout`)
    .json<{ message: string }>();
  return res;
};
