import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import duckduckgo from "@/libs/duckduckgo";
import openai from "@/libs/openai";

export const subjectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ subject: z.string().min(1) }))
    .mutation(async ({ ctx, input: { subject } }) => {
      const prompt = `I'm very dumb and didn't know anything about ${subject} yet. I need you to break the ${subject} down into modules as minimum as possible but cover the ${subject} from the very basic to the most advanced and should be connected.\n\nYou need to really consider deciding what are the best modules that I need to learn gradually and progressively with a minimum of 4 modules and a maximum of 10 modules.\n\nEach sub-topic also needs to be available and taught broadly on the Internet, especially on the Youtube platform. Return ONLY an array of modules with proper capitalization in each word and English grammar.\n\nEach of the module needs to be verbose and concise as much as possible and has a minimum of two words. Do not include any other output. Just the JSON array.`;
      const request = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You're a very smart teaching assistant that will teach me about ${subject}`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gpt-3.5-turbo-1106",
        response_format: {
          type: "json_object",
        },
      });

      /*       const event = trigger.sendEvent({
        name: "generate.modules",
        payload: { subject, userId: ctx.session.user.id },
      })
 */
      const response = request.choices[0]?.message.content;

      const { modules } = JSON.parse(response!) as { modules: string[] };

      const cover = await duckduckgo.getImage(subject);

      const data = await ctx.db.subject.create({
        data: {
          name: subject,
          moduleCount: modules.length,
          cover,
          User: { connect: { id: ctx.session.user.id } },
        },
      });

      return data.id;
    }),
  getAll: protectedProcedure
    .input(z.object({ page: z.number().min(0) }))
    .query(async ({ ctx, input: { page = 0 } }) => {
      const data = await ctx.db.subject.findMany({
        where: { userId: ctx.session.user.id },
        skip: page * 10,
        take: 10,
        orderBy: { createdAt: "desc" },
      });

      return data;
    }),
});
