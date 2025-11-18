import { ProfileIcon } from "@/app/_components";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full flex px-5 py-3 justify-between fixed ">
      <Image src="/logo.webp" alt="로고" width={60} height={60} />
      <div className="justify-end ">
        <ProfileIcon />
      </div>
    </header>
  );
}
