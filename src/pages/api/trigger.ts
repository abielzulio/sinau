import { trigger } from "@/libs/trigger";
import { createPagesRoute } from "@trigger.dev/nextjs";

import "@/jobs";

//uncomment this to set a higher max duration (it must be inside your plan limits). Full docs: https://vercel.com/docs/functions/serverless-functions/runtimes#max-duration
/* export const config = {
  maxDuration: 300,
}; */

//this route is used to send and receive data with Trigger.dev
const { handler, config: triggerConfig } = createPagesRoute(trigger);
export const config = {
  maxDuration: 300,
  ...triggerConfig.api,
};

export default handler;
