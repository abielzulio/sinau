import Head from "@/common/components/head";
import { env } from "@/env";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { TriggerProvider } from "@trigger.dev/react";
import { type AppType } from "next/app";
import Image from "next/image";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { Toaster } from "sonner";
import NextProgress from "next-progress";

if (
  typeof window !== "undefined" &&
  env.NEXT_PUBLIC_SINAU_ENABLE_ANALYTICS === "true"
) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
  });
}

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  const router = useRouter();

  useEffect(() => {
    // Track page views
    if (env.NEXT_PUBLIC_SINAU_ENABLE_ANALYTICS !== "true") return;
    const handleRouteChange = () => posthog?.capture("$pageview");
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <>
      <Head />
      <NextProgress color={"#000"} options={{ showSpinner: false }} />
      <Toaster richColors closeButton />
      <ClerkProvider {...pageProps}>
        <ClerkLoading>
          <main className="flex h-screen w-screen bg-off-white">
            <Image
              src="/brand/sinau-black.svg"
              alt="Sinau"
              width={48}
              height={48}
              className="mx-auto my-auto animate-pulse opacity-50"
            />
          </main>
        </ClerkLoading>
        <ClerkLoaded>
          <TriggerProvider
            publicApiKey={env.NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY}
          >
            {env.NEXT_PUBLIC_SINAU_ENABLE_ANALYTICS === "true" ? (
              <PostHogProvider client={posthog}>
                <Component {...pageProps} />
              </PostHogProvider>
            ) : (
              <Component {...pageProps} />
            )}
          </TriggerProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
