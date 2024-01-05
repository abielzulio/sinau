import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_DB_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    OPENAI_API_KEY: z.string(),
    TRIGGER_ID: z.string(),
    TRIGGER_API_KEY: z.string(),
    TRIGGER_API_URL: z.preprocess(
      (str) =>
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/api/trigger`
          : str,
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    CLERK_SECRET_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_SINAU_ENABLE_ANALYTICS: z.string().optional().default("false"),
    NEXT_PUBLIC_POSTHOG_KEY: z.preprocess(
      (bool) => bool,
      process.env.NEXT_PUBLIC_SINAU_ENABLE_ANALYTICS === "true"
        ? z.string()
        : z.string().optional(),
    ),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    TRIGGER_API_KEY: process.env.TRIGGER_API_KEY,
    TRIGGER_API_URL: process.env.TRIGGER_API_URL,
    TRIGGER_ID: process.env.TRIGGER_ID,
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY:
      process.env.NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_SINAU_ENABLE_ANALYTICS:
      process.env.NEXT_PUBLIC_SINAU_ENABLE_ANALYTICS,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
