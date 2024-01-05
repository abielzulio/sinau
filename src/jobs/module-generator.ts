import openai from "@/libs/openai";
import duckduckgo from "@/libs/duckduckgo";
import { trigger as client } from "@/libs/trigger";
import { db } from "@/server/db";
import { moduleGeneratorSchema } from "./schema";
import { eventTrigger } from "@trigger.dev/sdk";

client.defineJob({
  id: "module-generator",
  name: "Generate module reading material",
  version: "0.0.1",
  enabled: true,
  trigger: eventTrigger({
    name: "module.generator",
    schema: moduleGeneratorSchema,
  }),
  run: async ({ modules, transcript, subject }, io) => {
    for (const { id, title, overview } of modules) {
      await io.logger.info(`[module-generator] START: ${id}-${title}`);

      const { reading } = await io.runTask(
        `module-generator-${id}`,
        async () => {
          const content = `As a part of my "${subject}" subject learning especially with a topic called "${title}" with a general overview "${overview}". I want you to generate a reading material with formal writting style for my learning. 
        
        Give me the reading material as complete and concise as possible. You can divide the reading material into sequential sections if needed. I have a transcript also that you can use this additional context. Here is the transcript, "${transcript}". 
        
        Return the reading material without any starting sentence "Based on this transcription..."  and without any ending sentence something like "If you have any further questions or need clarification on any topic, feel free to ask. Happy learning!". 

        If sections are being used, please end the reading material section with "Conclusion" section as a summarization of all the sections above. Don't use section numbering. Use section title only for each section. Use H2 for section title heading.
        
        Just return the reading material only in markdown style. No need to give the markdown a title. Start the reading material with a sub-heading of the first section title.`;

          const request = await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: `You're a very smart teaching assistant that will teach me about "${subject}" subject`,
              },
              {
                role: "user",
                content,
              },
            ],
            temperature: 0.1,
            model: "gpt-3.5-turbo-16k-0613",
          });

          const response = request.choices[0]?.message.content;

          return { reading: response };
        },
      );

      const { references } = await io.runTask(
        `module-references-${id}`,
        async () => {
          const references = await duckduckgo.search(title);

          return { references };
        },
      );

      await io.runTask(`save-module-${id}`, async () => {
        return await db.module.update({
          where: { id },
          data: {
            reading,
            references: JSON.stringify(references),
          },
        });
      });

      await io.logger.info(`[module-generator] DONE: ${id}-${title}`);
      /* 
      return { reading, references }; */
    }

    return { modules, transcript, subject };
  },
});
