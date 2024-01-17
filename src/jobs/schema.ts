import { z } from "zod";

export const moduleGeneratorSchema = z.object({
  transcript: z.string(),
  subject: z.string(),
  modules: z.array(
    z.object({
      id: z.string(),
      overview: z.string(),
      title: z.string(),
    }),
  ),
  userId: z.string(),
});

export const videoTranscripterSchema = z.object({
  subject: z.string(),
  videos: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      modules: z.array(
        z.object({
          id: z.string(),
          overview: z.string().nullable(),
          title: z.string(),
        }),
      ),
    }),
  ),
  userId: z.string(),
});
