import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  getByModuleId: protectedProcedure
    .input(z.object({ moduleId: z.string().optional() }))
    .query(async ({ ctx, input: { moduleId } }) => {
      return await ctx.db.chat.findMany({
        where: { moduleId },
        orderBy: { createdAt: "asc" },
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
        return await ctx.db.chat.upsert({
          where: {
            id: d.id,
          },
          update: {
            role: d.role,
            content: d.content,
          },
          create: {
            id: d.id,
            moduleId: d.moduleId,
            role: d.role,
            content: d.content,
          },
        });
      });
    }),
});
