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
          if (request.url.includes("auth/refresh")) {
            return response;
          }

          try {
            await ky.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
              options,
            );

            return ky(request);
          } catch (error) {
            console.error("세션이 만료되었습니다. 다시 로그인해주세요.", error);
            throw error;
          }
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
