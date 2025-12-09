export interface Message {
  author: "user" | "Gemini";
  userId: string;
  senderProfileImage: string;
  senderName: string;
  content: string;
}

export interface ChatChunk {
  type: "CHAT_CHUNK";
  content: string;
}
