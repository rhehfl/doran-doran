import { User } from "./User";

export interface ChatRoomActive {
  roomId: number;
  count: number;
  users: User[];
}
