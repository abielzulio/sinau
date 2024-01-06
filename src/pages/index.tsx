import NavigationBar from "@/common/components/navigation-bar";
import { Button } from "@/common/components/ui/button";
import { useUser } from "@/common/hooks/user";
import { useRouter } from "next/router";

export default function HomePage() {
  const { isAuthenticated } = useUser();
  const { push } = useRouter();
  return (
    <>
      <NavigationBar>
        {isAuthenticated ? (
          <Button>Open Dashboard</Button>
        ) : (
          <Button onClick={() => push("/sign-in")}>Try Sinau</Button>
        )}
      </NavigationBar>
    </>
  );
}
