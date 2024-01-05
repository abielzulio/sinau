import { env } from "@/env";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { TriggerProvider } from "@trigger.dev/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { Toaster } from "sonner";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/brand/sinau-white.svg" type="image/svg+xml" />
        <title>Sinau</title>
      </Head>
      <Toaster richColors closeButton />
      <SessionProvider session={session}>
        <TriggerProvider publicApiKey={env.NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY}>
          <Component {...pageProps} />
        </TriggerProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
