import { env } from "@/env";
import { PostHog } from "posthog-node";

const posthog =
  env.NEXT_PUBLIC_SINAU_ENABLE_ANALYTICS === "true"
    ? new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY!, {
        host: env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
      })
    : undefined;

export default posthog;
