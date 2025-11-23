import { externalApi } from "@/app/_libs";
import { ChatRoom } from "common";
import { Options } from "ky";

export const getAllPublicChatRooms = async (options?: Options) => {
  const res = await externalApi
    .get(`api/chatrooms`, { ...options })
    .json<ChatRoom[]>();
  return res;
};
