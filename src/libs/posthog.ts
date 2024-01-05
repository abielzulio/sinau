import { env } from "@/env";
import { PostHog } from "posthog-node";

const posthog = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: env.NEXT_PUBLIC_POSTHOG_HOST,
});

export default posthog;
