import ky from "ky";
import { ERROR_CODE } from "common";

export const externalApi = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  cache: "no-store",
  headers: {
    "Content-Type": "application/json",
  },
  retry: 0,
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 500) {
          throw new Error("server error occurred");
        }

        if (response.status === 401) {
          console.error("인가되지 않은 접근 시도");
          throw new Error(ERROR_CODE.UNAUTHORIZED);
        }

        if (response.status === 403) {
          console.error("권한없음");
          throw new Error(ERROR_CODE.FORBIDDEN);
        }

        return response;
      },
    ],
  },
});

export const internalApi = ky.create({
  prefixUrl: "/api",
  cache: "no-store",
  headers: {
    "Content-Type": "application/json",
  },
});
