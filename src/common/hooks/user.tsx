import { useUser as useClerkAuth } from "@clerk/nextjs";

export const useUser = () => {
  const { isSignedIn, user, isLoaded } = useClerkAuth();
  return {
    user: isSignedIn ? user : null,
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn,
  };
};
