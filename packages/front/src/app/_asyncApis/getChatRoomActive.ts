import { externalApi } from "@/app/_libs";
import { ChatRoomActive } from "common";

export const getChatRoomActive = async (chatRoomId: number) => {
  const res = await externalApi
    .get(`api/chat/${chatRoomId}/active`)
    .json<ChatRoomActive>();
  return res;
};
