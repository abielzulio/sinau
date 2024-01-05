import openai from "@/libs/openai";
import { trigger as client } from "@/libs/trigger";
import { db } from "@/server/db";
import { eventTrigger } from "@trigger.dev/sdk";
import ytdl from "ytdl-core";
import { videoTranscripterSchema } from "./schema";

client.defineJob({
  id: "video-transcript",
  name: "Transcript a video",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "video.transcripter",
    schema: videoTranscripterSchema,
  }),
  run: async ({ videos, subject, userId }, io) => {
    for (const video of videos) {
      await io.logger.info(`[video-transcipter] START TRANSCRIPT: ${video.id}`);

      const { transcript } = await io.runTask(
        `transcripter-${video.id}`,
        async () => {
          const videoInfo = await ytdl.getInfo(video.url);
          const videoFormat = ytdl.chooseFormat(videoInfo.formats, {
            quality: "highestaudio",
            filter: "audioonly",
          });

          const fileName = `${videoInfo.videoDetails.title}.mp3`;

          const stream = ytdl(video.url, {
            filter: "audioonly",
            quality: "highestaudio",
            format: videoFormat,
          });

          const promise = new Promise(
            (resolve: (value: string) => void, reject) => {
              const chunks: Buffer[] = [];

              stream.on("data", (chunk: Buffer) => {
                chunks.push(chunk);
              });
              stream.on("end", () => {
                const buffer = Buffer.concat(chunks);
                const blob = new Blob([buffer]);
                const file = new File([blob], fileName);

                const whisper = openai.audio.transcriptions.create({
                  model: "whisper-1",
                  file,
                  temperature: 0,
                  response_format: "json",
                  language: "en",
                });

                whisper
                  .then((data) => {
                    resolve(data.text);
                  })
                  .catch((e) => {
                    reject(e);
                  });
              });
            },
          );

          return { transcript: await promise };
        },
      );

      await io.logger.info(`[video-transcipter] DONE TRANSCRIPT: ${video.id}`);

      await io.logger.info(`[video-transcipter] SAVE TRANSCRIPT: ${video.id}`);

      await io.runTask(`save-transcript-${video.id}`, async () => {
        await db.video.update({
          where: { id: video.id },
          data: {
            transcript,
          },
        });
      });

      await io.logger.info(`[video-transcipter] TRANSCRIPT SAVED: ${video.id}`);

      await io.sendEvent(`module-generator-${video.id}`, {
        name: "module.generator",
        payload: {
          modules: video.modules,
          subject,
          transcript,
          userId,
        },
      });

      await io.logger.info(`[video-transcipter] DONE: ${video.id}`);

      // TODO: Send email to user if process done

      /*       return { transcript }; */
    }

    return { videos, userId };
  },
});
