import * as Avatar from "@/common/components/ui/avatar";
import * as Dropdown from "@/common/components/ui/dropdown";
import { Image } from "@/common/components/ui/image";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { type PropsWithChildren } from "react";
import { useUser } from "../hooks/user";

const NavigationBar = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useUser();

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
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Avatar.Root>
              {user?.image ? (
                <Avatar.Image src={user?.image} alt="Avatar" />
              ) : null}
              <Avatar.Fallback isLoading={isLoading}>
                {isLoading
                  ? null
                  : (user?.name ?? user?.email?.split("@"))?.[0]}
              </Avatar.Fallback>
            </Avatar.Root>
          </Dropdown.Trigger>
          <Dropdown.Content align="end" sideOffset={10}>
            <Dropdown.Item
              className="flex items-center gap-[10px] hover:cursor-pointer"
              onClick={() => void signOut()}
            >
              <LogOut size={14} />
              Sign out
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
    </nav>
  );
};

export default NavigationBar;
