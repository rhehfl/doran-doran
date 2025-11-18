import { getMe } from "@/app/_asyncApis";
import { postLogout } from "@/app/_asyncApis/postLogout";
import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { Options } from "ky";

export const userQueries = {
  all: () => ["users"] as const,
  me: (options?: Options) =>
    queryOptions({
      queryKey: [...userQueries.all(), "me"] as const,
      queryFn: () => getMe(options),
      gcTime: Infinity,
      staleTime: Infinity,
    }),
  logout: () => {
    const queryClient = useQueryClient();
    return mutationOptions({
      mutationFn: postLogout,
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: userQueries.all() });
      },
    });
  },
};
