import openai from "@/libs/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

export default async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages);
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
