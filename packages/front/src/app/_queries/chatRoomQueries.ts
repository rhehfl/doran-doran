import {
  getAllMyChatRooms,
  getAllPublicChatRooms,
  getChatRoomHistory,
  getChatRoomInfo,
  postChatRoom,
} from "@/app/_asyncApis";
import { getChatRoomActive } from "@/app/_asyncApis/getChatRoomActive";
import { patchChatRoomStatus } from "@/app/_asyncApis/patchChatRoomStatus";
import {
  mutationOptions,
  queryOptions,
  useQueryClient,
} from "@tanstack/react-query";

export const chatRoomQueries = {
  all: () => ["chatRooms"] as const,
  list: () => [...chatRoomQueries.all(), "list"] as const,
  publicList: () =>
    queryOptions({
      queryKey: [...chatRoomQueries.list(), "public"],
      queryFn: () => getAllPublicChatRooms(),
      staleTime: 60 * 1000 * 5,
    }),
  myList: () =>
    queryOptions({
      queryKey: [...chatRoomQueries.list(), "my"],
      queryFn: () => getAllMyChatRooms(),
      staleTime: 60 * 1000 * 5,
    }),
  details: () => [...chatRoomQueries.all(), "details"] as const,
  detail: (roomId: number) =>
    queryOptions({
      queryKey: [...chatRoomQueries.details(), roomId],
      queryFn: () => getChatRoomInfo(roomId),
    }),
  history: (roomId: number) =>
    queryOptions({
      queryKey: [...chatRoomQueries.details(), roomId, "history"] as const,
      queryFn: () => getChatRoomHistory(roomId),
    }),
  active: (roomId: number) =>
    queryOptions({
      queryKey: [...chatRoomQueries.details(), roomId, "active"] as const,
      queryFn: () => getChatRoomActive(roomId),
    }),
};

export const chatRoomMutations = {
  createRoom: () => {
    const queryClient = useQueryClient();
    return mutationOptions({
      mutationFn: postChatRoom,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: chatRoomQueries.list(),
        });
      },
    });
  },
  patchStatus: (roomId: number) => {
    const queryClient = useQueryClient();

    return mutationOptions({
      mutationFn: patchChatRoomStatus,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: chatRoomQueries.detail(roomId).queryKey,
        });
      },
    });
  },
};
