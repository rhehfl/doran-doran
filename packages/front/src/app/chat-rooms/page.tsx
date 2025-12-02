import { SuspenseChatRoomListWrapper } from "@/app/chat-rooms/_components";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { cookies } from "next/headers";
import { chatRoomQueries } from "@/app/_queries";
import { SsgoiTransition } from "@ssgoi/react";
import { getAllMyChatRooms, getAllPublicChatRooms } from "@/app/_asyncApis";
import { cookieParser } from "@/app/_utils";
import ChatHeader from "@/app/chat-rooms/_components/ChatHeader";
import { SaveCurrentPathToLocalStorage } from "@/app/_components";

export default async function ChatRoomsPage() {
  const queryClient = new QueryClient();
  const cookieStore = await cookies();

  const cookieString = cookieParser(cookieStore);

  const myChatRoomQuery = chatRoomQueries.myList();
  const publicChatRoomQuery = chatRoomQueries.publicList();

  const options = {
    headers: {
      Cookie: cookieString,
    },
  };
  await queryClient.prefetchQuery({
    queryKey: myChatRoomQuery.queryKey,
    queryFn: () => getAllMyChatRooms(options),
    staleTime: 1000 * 60 * 5,
  });

  await queryClient.prefetchQuery({
    queryKey: publicChatRoomQuery.queryKey,
    queryFn: () => getAllPublicChatRooms(options),
    staleTime: 1000 * 60 * 5,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <SsgoiTransition id="/chat-rooms" className="relative">
      <ChatHeader />
      <SaveCurrentPathToLocalStorage />
      <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            현재 채팅 목록
          </h1>
          <HydrationBoundary state={dehydratedState}>
            <SuspenseChatRoomListWrapper />
          </HydrationBoundary>
          <div className="pt-8 text-center ">
            <Link href="/chat-rooms/personas">
              <button
                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md transition duration-150
                         dark:bg-indigo-500 dark:hover:bg-indigo-600 cursor-pointer"
              >
                + 새로운 AI와 대화 시작하기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}
