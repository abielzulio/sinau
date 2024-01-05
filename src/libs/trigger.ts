import { env } from "@/env";
import { TriggerClient } from "@trigger.dev/sdk";

export const trigger = new TriggerClient({
  id: env.TRIGGER_ID,
  apiKey: env.TRIGGER_API_KEY,
  apiUrl: env.TRIGGER_API_URL,
});
