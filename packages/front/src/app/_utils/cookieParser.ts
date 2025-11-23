import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const cookieParser = (cookieStore: ReadonlyRequestCookies) => {
  const sessionToken = cookieStore.get("chat_session_id")?.value;
  const authToken = cookieStore.get("authToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieString = [
    sessionToken && `chat_session_id=${sessionToken}`,
    authToken && `authToken=${authToken}`,
    refreshToken && `refreshToken=${refreshToken}`,
  ]
    .filter(Boolean)
    .join("; ");
  return cookieString;
};
