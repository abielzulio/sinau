import { env } from "@/env";
import { TriggerClient } from "@trigger.dev/sdk";
import { OpenAI } from "@trigger.dev/openai";

export const trigger = new TriggerClient({
  id: env.TRIGGER_ID,
  apiKey: env.TRIGGER_API_KEY,
  apiUrl: env.TRIGGER_API_URL,
});

export const openai = new OpenAI({
  id: "openai",
  apiKey: env.OPENAI_API_KEY,
});
