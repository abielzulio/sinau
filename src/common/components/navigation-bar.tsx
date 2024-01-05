import { Image } from "@/common/components/ui/image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { type PropsWithChildren } from "react";

const NavigationBar = ({ children }: PropsWithChildren) => {
  return (
    <nav className="fixed z-10 flex w-screen flex-row items-center justify-between bg-off-white py-[18px] pl-[24px] pr-[32px]">
      <Link href="/subject" className="flex flex-row items-center gap-[10px]">
        <Image
          src="/brand/sinau-black.svg"
          alt="Sinau Logo"
          className="h-[18px] w-[18px]"
        />
        <p className="font-medium">Sinau</p>
      </Link>
      <div className="flex flex-row items-center gap-[15px]">
        {children}
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default NavigationBar;
