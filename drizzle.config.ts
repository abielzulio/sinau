import type { Config } from "drizzle-kit";
import { env } from "@/env";

export default {
  schema: "./drizzle/*.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
