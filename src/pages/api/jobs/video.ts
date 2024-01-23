import { trigger } from "@/libs/trigger";
import { getServerAuthSession } from "@/server/auth";
import { type NextApiRequest, type NextApiResponse } from "next";

interface Payload {
  id: string;
  subject: string;
  videos: Array<{
    id: string;
    title: string | null;
    overview: string;
  }>;
  userId: string;
}
interface Request extends NextApiRequest {
  body: Payload;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST")
      return res.status(404).json({ message: "Method not allowed" });

    const session = await getServerAuthSession({ req, res });

    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const { id, videos, userId, subject } = JSON.parse(req.body) as Payload;

    if (!id) return res.status(400).json({ message: `"id" is required` });

    if (!videos)
      return res.status(400).json({ message: `"videos" is required` });

    if (!userId)
      return res.status(400).json({ message: `"userId" is required` });

    if (!subject)
      return res.status(400).json({ message: `"subject" is required` });

    const event = await trigger.sendEvent({
      name: "video.transcripter",
      payload: {
        subject,
        videos,
        userId,
      },
      id,
    });

    console.log(event);

    return res.status(200).json({ message: event.name });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: e instanceof Error ? e.message : JSON.stringify(e),
    });
  }
}
