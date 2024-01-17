import { type ModuleWithVideo } from "@/server/db/query";
import { Maybe } from "@/type";
import { api } from "@/utils/api";
import { useChat } from "ai/react";
import { useEffect } from "react";

type Role = "function" | "user" | "data" | "system" | "assistant" | "tool";

const useChatModule = (
  selectedModule: Maybe<ModuleWithVideo>,
  subjectName: Maybe<string>,
) => {
  const { data: chats } = api.chat.getByModuleId.useQuery({
    moduleId: selectedModule?.id,
  });
  const { mutate } = api.chat.post.useMutation();
  const chatHook = useChat({
    initialMessages:
      !chats || chats?.length === 0
        ? [
            {
              id: "1",
              role: "system",
              content:
                `You're a helpful assistant that would help user to learn about ${selectedModule?.title}` +
                `You'll answer about any question constrained only about ${selectedModule?.title} and ${subjectName}. Here's an additional context that you can use to answer a relevant question  about about ${selectedModule?.title} and ${subjectName}: ${selectedModule?.video.transcript}`,
            },
          ]
        : [
            ...chats
              .sort((a, b) => {
                const dateComparison =
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime();

                if (dateComparison !== 0) {
                  return dateComparison; // Sort by date
                }
                if (a.role === "user" && b.role !== "user") {
                  return -1; // a comes first (user)
                } else if (a.role !== "user" && b.role === "user") {
                  return 1; // b comes first (user)
                } else {
                  return 0; // roles are the same or both not 'user', maintain the order
                }
              })
              .map((d) => ({
                id: d.id,
                role: d.role as Role,
                content: d.content,
              })),
          ],
  });

  useEffect(() => {
    if (chatHook.isLoading || !selectedModule || chatHook.messages.length === 1)
      return;
    mutate({
      data: [
        ...chatHook.messages.map((d) => {
          return {
            id: d.id,
            moduleId: selectedModule.id,
            role: d.role,
            content: d.content,
          };
        }),
      ],
    });
  }, [chatHook.isLoading]);

  useEffect(() => {
    if (!selectedModule || !chats) return;
    chatHook.setMessages([
      ...chats
        .sort((a, b) => {
          const dateComparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

          if (dateComparison !== 0) {
            return dateComparison; // Sort by date
          }
          if (a.role === "user" && b.role !== "user") {
            return -1; // a comes first (user)
          } else if (a.role !== "user" && b.role === "user") {
            return 1; // b comes first (user)
          } else {
            return 0; // roles are the same or both not 'user', maintain the order
          }
        })
        .map((d) => ({
          id: d.id,
          role: d.role as Role,
          content: d.content,
        })),
    ]);
  }, [selectedModule]);

  return chatHook;
};

export default useChatModule;
