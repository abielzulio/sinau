import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import duckduckgo from "@/libs/duckduckgo";
import openai from "@/libs/openai";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { type Module } from "@/type";
import { TRPCError } from "@trpc/server";
import youtube from "@/libs/youtube";
import { sleep } from "@/utils";

const baseMessage = (subject: string): ChatCompletionMessageParam[] => {
  const prompt = `I'm very dumb and didn't know anything about "${subject}" subject yet and now I'm going to learn "${subject}" subject with zero knowledge. I need you to create a learning path for me to learn "${subject}" subject by breaking the "${subject}" subject down into modules as concise and complete as possible from the very basic into the most advanced and should be connected from the beginning to the end.\n\nYou need to really consider deciding what are the best modules that I need to learn gradually and progressively with maximum 15 modules.\n\nEach modules should containt the module title and the module short overview of what I'm going to learn. Return ONLY an array of object with "title" and "overview" key under "modules" array key with proper capitalization in each object and English grammar.\n\nEach of the module needs to be verbose and concise as much as possible and has a minimum of two words. Do not include any other output. Just the JSON array.`;
  return [
    {
      role: "system",
      content: `You're a very smart teaching assistant that will teach me about "${subject}" subject`,
    },
    {
      role: "user",
      content: prompt,
    },
  ];
};

export const subjectRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(z.object({ subject: z.string().min(1) }))
    .mutation(async ({ input: { subject } }) => {
      const request = await openai.chat.completions.create({
        messages: [...baseMessage(subject)],
        model: "gpt-3.5-turbo-1106",
        response_format: {
          type: "json_object",
        },
      });

      const response = request.choices[0]?.message.content;

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again",
        });
      }

      const { modules } = JSON.parse(response) as { modules: Module[] };

      if (modules.length === 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again",
        });
      }

      return modules;
    }),
  regenerate: protectedProcedure
    .input(
      z.object({
        subject: z.string().min(1),
        modules: z.array(
          z.object({
            title: z.string(),
            overview: z.string(),
          }),
        ),
        feedback: z.string().min(1),
      }),
    )
    .mutation(async ({ input: { modules, feedback, subject } }) => {
      const request = await openai.chat.completions.create({
        messages: [
          ...baseMessage(subject),
          {
            role: "assistant",
            content: JSON.stringify(modules),
          },
          {
            role: "user",
            content: `As I want to start my learning journey to learn more about "${subject}" subject, I want you to regenerate, restructure, alter, or anything that you needed to do to improve my learning path with my feedback as a base: "${feedback}"`,
          },
        ],
        model: "gpt-3.5-turbo-1106",
        response_format: {
          type: "json_object",
        },
      });

      const response = request.choices[0]?.message.content;

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again",
        });
      }

      const { modules: newModules } = JSON.parse(response) as {
        modules: Module[];
      };

      if (newModules.length === 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, please try again",
        });
      }

      return newModules;
    }),
  create: protectedProcedure
    .input(
      z.object({
        subject: z.string().min(1),
        modules: z.array(
          z.object({
            title: z.string(),
            overview: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input: { subject, modules } }) => {
      const cover = await duckduckgo.getImage(subject);

      const data = await ctx.db.subject.create({
        data: {
          name: subject,
          cover,
          User: { connect: { id: ctx.session.user.id } },
        },
      });

      for (const { title, overview } of modules) {
        const video = await youtube.getVideo(`${subject} - ${title}`);

        const payload = {
          id: video.id,
          title: video.title,
          cover: video.cover,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          transcript: "",
        };

        await ctx.db.video.upsert({
          where: { id: video.id },
          create: payload,
          update: payload,
        });

        /*         const references = await duckduckgo.search(title);

        await sleep(5000);
 */
        const _module = await ctx.db.module.create({
          data: {
            title,
            overview,
            /*             reference: JSON.stringify(references), */
            video: { connect: { id: video.id } },
            subject: { connect: { id: data.id } },
          },
        });

        if (title === modules[0]?.title) {
          await ctx.db.subject.update({
            where: { id: data.id },
            data: {
              lastSelectedModuleId: _module.id,
              lastActiveModuleId: _module.id,
            },
          });
        }
      }

      return data.id;
    }),
  getAll: protectedProcedure
    .input(z.object({ page: z.number().min(0) }))
    .query(async ({ ctx, input: { page = 0 } }) => {
      const data = await ctx.db.subject.findMany({
        select: {
          id: true,
          name: true,
          cover: true,
          isCompleted: true,
          createdAt: true,
          updatedAt: true,
          modules: {
            select: {
              id: true,
            },
          },
        },
        where: { userId: ctx.session.user.id },
        skip: page * 10,
        take: 10,
        orderBy: { createdAt: "desc" },
      });

      return data;
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      const data = await ctx.db.subject.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          cover: true,
          isCompleted: true,
          createdAt: true,
          updatedAt: true,
          modules: {
            select: {
              id: true,
              title: true,
              overview: true,
              video: {
                select: {
                  id: true,
                  title: true,
                  cover: true,
                  url: true,
                  transcript: true,
                },
              },
            },
          },
        },
      });

      return data;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          isCompleted: z.boolean().optional(),
          lastSelectedModuleId: z.string().optional(),
          lastActiveModuleId: z.string().optional(),
          updatedAt: z.date().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input: { id, data } }) => {
      return await ctx.db.subject.update({
        where: { id },
        data,
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.db.subject.delete({ where: { id } });

      return true;
    }),
});
