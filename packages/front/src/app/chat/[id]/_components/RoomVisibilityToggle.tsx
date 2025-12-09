import { ToggleButton } from "@/app/_components";
import { chatRoomMutations } from "@/app/_queries";
import { useMutation } from "@tanstack/react-query";

interface RoomVisibilityToggleProps {
  roomId: number;
  defaultChecked: boolean;
}
export default function RoomVisibilityToggle({
  roomId,
  defaultChecked,
}: RoomVisibilityToggleProps) {
  const { mutate: patchStatus } = useMutation(
    chatRoomMutations.patchStatus(roomId),
  );
  return (
    <ToggleButton
      defaultChecked={defaultChecked}
      onTurnOn={() => patchStatus({ chatRoomId: roomId, isPublic: true })}
      onTurnOff={() => patchStatus({ chatRoomId: roomId, isPublic: false })}
    />
  );
}
