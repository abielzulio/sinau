import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const moduleRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.db.module.findUnique({
        where: { id },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          notes: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.module.update({
        where: {
          id: input.id,
        },
        data: {
          notes: input.data.notes,
        },
      });
    }),
});
