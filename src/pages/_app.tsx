import Head from "@/common/components/head";
import { env } from "@/env";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import { TriggerProvider } from "@trigger.dev/react";
import { type AppType } from "next/app";

import { Toaster } from "sonner";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <>
      <Head />
      <Toaster richColors closeButton />
      <ClerkProvider {...pageProps}>
        <TriggerProvider publicApiKey={env.NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY}>
          <Component {...pageProps} />
        </TriggerProvider>
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
