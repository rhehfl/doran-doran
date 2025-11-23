import { userQueries } from "@/app/_queries";
import { cookieParser } from "@/app/_utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const queryClient = new QueryClient();

  const cookieString = cookieParser(cookieStore);
  const userQuery = userQueries.me({
    headers: {
      Cookie: cookieString,
    },
  });

  await queryClient.prefetchQuery(userQuery);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
