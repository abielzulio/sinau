import { createTRPCRouter } from "@/server/api/trpc";
import { subjectRouter } from "./routers/subject";
import { moduleRouter } from "./routers/module";
import { chatRouter } from "./routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  subject: subjectRouter,
  module: moduleRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
