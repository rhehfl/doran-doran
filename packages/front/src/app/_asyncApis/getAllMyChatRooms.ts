import { externalApi } from "@/app/_libs";
import { ChatRoom } from "common";
import { Options } from "ky";

export const getAllMyChatRooms = async (options?: Options) => {
  const res = await externalApi
    .get(`api/chatrooms/me`, { ...options })
    .json<ChatRoom[]>();
  return res;
};
