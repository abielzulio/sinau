import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { subjectModule } from "drizzle/schema";
import { eq } from "drizzle-orm";

export const moduleRouter = createTRPCRouter({
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
      return await ctx.db
        .update(subjectModule)
        .set({
          notes: input.data.notes,
        })
        .where(eq(subjectModule.id, input.id));
    }),
});
