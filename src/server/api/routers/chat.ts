import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { chat } from "drizzle/schema";
import { eq } from "drizzle-orm";

export const chatRouter = createTRPCRouter({
  getByModuleId: protectedProcedure
    .input(z.object({ moduleId: z.string().optional() }))
    .query(async ({ ctx, input: { moduleId } }) => {
      if (!moduleId) return;
      return await ctx.db.query.chat.findMany({
        where: (chat, { eq }) => eq(chat.moduleId, moduleId),
      });
    }),
  post: protectedProcedure
    .input(
      z.object({
        data: z.array(
          z.object({
            id: z.string(),
            moduleId: z.string(),
            role: z.string(),
            content: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input: { data } }) => {
      return data.map(async (d) => {
        return await ctx.db
          .insert(chat)
          .values({
            id: d.id,
            moduleId: d.moduleId,
            role: d.role,
            content: d.content,
          })
          .onConflictDoUpdate({
            target: chat.id,
            set: {
              role: d.role,
              content: d.content,
            },
            where: eq(chat.id, d.id),
          });
      });
    }),
});
