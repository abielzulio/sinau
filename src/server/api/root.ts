import { createTRPCRouter } from "@/server/api/trpc";
import { subjectRouter } from "./routers/subject";
import { moduleRouter } from "./routers/module";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  subject: subjectRouter,
  module: moduleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
