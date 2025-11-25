import { getMe } from "@/app/_asyncApis";
import { postLogout } from "@/app/_asyncApis/postLogout";
import { chatRoomQueries } from "@/app/_queries/chatRoomQueries";
import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { Options } from "ky";
import { toast } from "react-toastify";

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
        toast.success("로그아웃 성공!");
        queryClient.invalidateQueries({ queryKey: userQueries.all() });
        queryClient.invalidateQueries({ queryKey: chatRoomQueries.all() });
      },
    });
  },
};
