import { externalApi } from "@/app/_libs";
import { ChatRoom } from "common";

interface patchChatRoomStatusRequest {
  chatRoomId: number;
  isPublic: boolean;
}
export const patchChatRoomStatus = async ({
  chatRoomId,
  isPublic,
}: patchChatRoomStatusRequest) => {
  const response = await externalApi
    .patch(`api/chatrooms/${chatRoomId}/status`, {
      json: { isPublic },
    })
    .json<ChatRoom>();

  return response;
};
