import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

import { env } from "@/env";
import duckduckgo from "@/libs/duckduckgo";
import openai from "@/libs/openai";
import posthog from "@/libs/posthog";
import { trigger } from "@/libs/trigger";
import youtube from "@/libs/youtube";
import { subject } from "@/server/db/query";
import { type Module } from "@/type";
import { TRPCError } from "@trpc/server";
import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getBaseUrl } from "@/utils/api";

const baseMessage = (subject: string): ChatCompletionMessageParam[] => {
  /*   const prompt = `I'm very dumb and didn't know anything about "${subject}" subject yet and now I'm going to learn "${subject}" subject with zero knowledge. I need you to create a learning path for me to learn "${subject}" subject by breaking the "${subject}" subject down into modules as concise and complete as possible from the very basic into the most advanced and should be connected from the beginning to the end.\n\nYou need to really consider deciding what are the best modules that I need to learn gradually and progressively. You can make it concise as possible if needed from 4 modules or make it maximum into 15 modules maximal.\n\nEach modules should containt the module title and the module short overview of what I'm going to learn. Return ONLY an array of object with "title" and "overview" key under "modules" array key with proper capitalization in each object and English grammar.\n\nEach of the module needs to be verbose and concise as much as possible and has a minimum of two words. Do not include any other output. Just the JSON array.`; */
  const prompt = `I'm very dumb and didn't know anything about "${subject}" subject yet and now I'm going to learn "${subject}" subject with zero knowledge. I need you to create a learning path for me to learn "${subject}" subject by breaking the "${subject}" subject down into modules as concise and complete as possible from the very basic into the most advanced and should be connected from the beginning to the end.\n\nYou need to really consider deciding what are the best modules that I need to learn gradually and progressively. You need to make it concise as possible to maximal 2 modules.\n\nEach modules should containt the module title and the module short overview of what I'm going to learn. Return ONLY an array of object with "title" and "overview" key under "modules" array key with proper capitalization in each object and English grammar.\n\nEach of the module needs to be verbose and concise as much as possible and has a minimum of two words. Do not include any other output. Just the JSON array.`;
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
    .mutation(async ({ input: { subject }, ctx }) => {
      const exist = await ctx.db.subject.findFirst({
        select: { id: true },
        where: { name: subject, userId: ctx.session.user.id },
      });

      if (exist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Subject "${subject}" already exist`,
        });
      }

      const request = await openai.chat.completions.create({
        messages: [...baseMessage(subject)],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.1,
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

      posthog?.capture({
        distinctId: ctx.session.user.email ?? ctx.session.user.id,
        event: "Subject: generate initial subject module",
        properties: {
          $subject: subject,
        },
      });

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
    .mutation(async ({ input: { modules, feedback, subject }, ctx }) => {
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
        temperature: 0.1,
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

      posthog?.capture({
        distinctId: ctx.session.user.email ?? ctx.session.user.id,
        event: "Subject: regenerate initial subject module",
        properties: {
          $subject: subject,
          $feedback: feedback,
        },
      });

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
          lastActiveModuleId: "",
          lastSelectedModuleId: "",
          User: { connect: { id: ctx.session.user.id } },
        },
      });

      for (const [id, { title, overview }] of modules.entries()) {
        const yt = await youtube.getVideo(`${subject} - ${title}`);

        const payload = {
          id: yt.id,
          title: yt.title,
          cover: yt.cover,
          url: `https://www.youtube.com/watch?v=${yt.id}`,
        };

        const video = await ctx.db.video.upsert({
          where: { id: yt.id },
          create: { ...payload, transcript: "" },
          update: payload,
        });

        const mod = await ctx.db.module.create({
          data: {
            title,
            overview,
            order: id + 1,
            reading: "",
            video: { connect: { id: video.id } },
            subject: { connect: { id: data.id } },
          },
        });

        if (title === modules[0]?.title) {
          await ctx.db.subject.update({
            where: { id: data.id },
            data: {
              lastSelectedModuleId: mod.id,
              lastActiveModuleId: mod.id,
            },
          });
        }
      }

      const videosWithNoTranscript = await ctx.db.video.findMany({
        select: {
          id: true,
          url: true,
          modules: {
            select: {
              id: true,
              overview: true,
              title: true,
            },
          },
        },
        where: {
          modules: {
            some: {
              subjectId: data.id,
              reading: {
                equals: "",
              },
            },
          },
          transcript: {
            equals: "",
          },
        },
      });

      // TODO: Handle if video already exist but the module reading material isn't exist
      if (videosWithNoTranscript.length > 0) {
        try {
          const payload = {
            id: data.id,
            subject,
            videos: videosWithNoTranscript,
            userId: ctx.session.user.id,
          };

          const event = await trigger.sendEvent({
            name: "video.transcripter",
            payload: {
              subject: data.name,
              videos: videosWithNoTranscript,
              userId: ctx.session.user.id,
            },
            id: data.id,
          });

          if (!event) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Something went wrong, please try again",
            });
          }

          /* 
          const req = await fetch(getBaseUrl() + "/api/jobs/video", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const res = await req.json();

          if (!req.ok) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: res.message,
            });
          }
 */
          return data.id;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message:
              error instanceof Error ? error.message : JSON.stringify(error),
          });
        }
      }

      /*       const videosWithTranscript = await ctx.db.video.findMany({
        select: {
          id: true,
          url: true,
          transcript: true,
          modules: {
            select: {
              id: true,
              overview: true,
              title: true,
            },
          },
        },
        where: {
          modules: {
            some: {
              subjectId: data.id,
              reading: {
                equals: "",
              },
            },
          },
          transcript: {
            not: {
              equals: "",
            },
          },
        },
      });

      if (videosWithTranscript.length > 0) {
        for (const { transcript, modules } of videosWithTranscript) {
          await trigger.sendEvent({
            name: "module.generator",
            payload: {
              modules,
              transcript: transcript,
              subject: data.name,
              userId: ctx.session.user.id,
            },
            source: env.TRIGGER_ID,
          });
        }
      }
 */
      posthog?.capture({
        distinctId: ctx.session.user.email ?? ctx.session.user.id,
        event: "Subject: create module",
        properties: {
          $subject: subject,
          $modules_count: modules.length,
        },
      });

      return data.id;
    }),
  getAll: protectedProcedure
    .input(z.object({ page: z.number().min(0) }))
    .query(async ({ ctx, input: { page = 0 } }) => {
      return await subject.getAll(ctx.db, ctx.session.user.id, page);
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return await subject.getById(ctx.db, id);
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
      const data = await ctx.db.subject.delete({ where: { id } });

      posthog?.capture({
        distinctId: ctx.session.user.email ?? ctx.session.user.id,
        event: "Subject: delete",
        properties: {
          $subject: data.name,
        },
      });

      return true;
    }),
});
