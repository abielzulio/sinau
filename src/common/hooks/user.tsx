import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: sessionData, status } = useSession();
  return {
    user: sessionData?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
};
