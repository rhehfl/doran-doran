import { SOCIAL_ORIGINS } from "@/app/_constants";
import { userQueries } from "@/app/_queries";
import { cookieParser } from "@/app/_utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies, headers } from "next/headers";
import { ReactNode } from "react";

export default async function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const headersList = await headers();
  const referer = headersList.get("referer") || "";
  const isSocialRedirect = SOCIAL_ORIGINS.some((origin) =>
    referer.includes(origin),
  );

  const queryClient = new QueryClient();

  if (!isSocialRedirect) {
    const cookieStore = await cookies();
    const cookieString = cookieParser(cookieStore);
    const userQuery = userQueries.me({
      headers: {
        Cookie: cookieString,
      },
    });

    await queryClient.prefetchQuery(userQuery);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
