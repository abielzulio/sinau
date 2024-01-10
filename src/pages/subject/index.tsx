import NavigationBar from "@/common/components/navigation-bar";
import * as Accordion from "@/common/components/ui/accordion";
import { Button } from "@/common/components/ui/button";
import * as Dialog from "@/common/components/ui/dialog";
import { handleClientError } from "@/common/components/ui/error";
import { Image } from "@/common/components/ui/image";
import { Input } from "@/common/components/ui/input";
import { Skeleton } from "@/common/components/ui/skeleton";
import { Textarea } from "@/common/components/ui/textarea";
import { type Module } from "@/type";
import { api } from "@/utils/api";
import { getRelativeTimeString } from "@/utils/date";
import {
  Book,
  BookPlus,
  Calendar,
  Clock9,
  MessageSquarePlus,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";

export default function SubjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [input, setInput] = useState<{
    subject?: string;
    feedback?: string;
  }>();
  const [modules, setModules] = useState<Module[]>([]);
  const [state, setState] = useState<"INITIATE" | "CONFIRMATION">("INITIATE");

  const { push } = useRouter();

  const subject = {
    generate: api.subject.generate.useMutation({
      onSuccess: (data) => {
        setModules(data);
        setState("CONFIRMATION");
      },
      onError: (error) => handleClientError(error.message),
    }),
    regenerate: api.subject.regenerate.useMutation({
      onSuccess: (data) => {
        setModules(data);
        toast.success("Learning path is regenerated");
      },
      onError: (error) => handleClientError(error.message),
    }),
    create: api.subject.create.useMutation({
      onSuccess: async (id) => {
        setShowModal(false);
        console.log("done", id);
        /*         toast.success("Learning path is created");
        await push(`/subject/${id}`); */
      },
      onError: (error) => handleClientError(error.message),
    }),
    all: api.subject.getAll.useQuery({ page: 0 }),
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!input?.subject) return;
    if (state === "INITIATE") {
      return await subject.generate.mutateAsync({ subject: input.subject });
    }
    await subject.create.mutateAsync({
      subject: input.subject,
      modules,
    });
    await subject.all.refetch();
  };

  const onRegenerate = async () => {
    if (!input?.subject) return;
    if (!input?.feedback) return handleClientError("Please fill the feedback");
    await subject.regenerate.mutateAsync({
      subject: input.subject,
      feedback: input.feedback,
      modules,
    });
    setShowFeedback(false);
    setInput((prev) => ({ ...prev, feedback: undefined }));
  };

  return (
    <>
      <NavigationBar>
        {subject.all.data && subject.all.data.length > 0 ? (
          <Button
            onClick={() => setShowModal(true)}
            type="button"
            icon={{
              icon: BookPlus,
            }}
          >
            Learn New Subject
          </Button>
        ) : null}
      </NavigationBar>

      <main className="min-w-screen flex min-h-screen flex-col bg-off-white px-[24px] pb-[32px] pt-[80px]">
        <Dialog.Root
          open={showModal}
          onOpenChange={(open) => setShowModal(open)}
        >
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {state === "INITIATE"
                  ? "Learn New Subject"
                  : "Review Your Modules"}
              </Dialog.Title>
              <Dialog.Description>
                {state === "INITIATE"
                  ? "What are you going to learn?"
                  : "Here are the modules that you're going to learn"}
              </Dialog.Description>
            </Dialog.Header>
            <form
              className="flex w-full flex-col gap-[20px] text-left"
              onSubmit={onSubmit}
            >
              {state === "INITIATE" ? (
                <div className="flex flex-col gap-[10px]">
                  <Input
                    id="subject"
                    placeholder="Thermodynamics"
                    className="w-full"
                    type="text"
                    required
                    defaultValue={input?.subject}
                    onChange={(e) =>
                      setInput((prev) => ({
                        ...prev,
                        subject: e.currentTarget.value,
                      }))
                    }
                  />
                </div>
              ) : modules.length > 0 ? (
                <div className="flex flex-col gap-[10px]">
                  <div className="max-h-[450px] overflow-y-auto pr-[6px]">
                    <Accordion.Root type="single" collapsible>
                      {modules.map((module, id) => (
                        <Accordion.Item value={module.title} key={id}>
                          <Accordion.Trigger className="items-start text-left">
                            #{id + 1} {module.title}
                          </Accordion.Trigger>
                          <Accordion.Content className="opacity-50">
                            {module.overview}
                          </Accordion.Content>
                        </Accordion.Item>
                      ))}
                    </Accordion.Root>
                  </div>
                  {showFeedback ? (
                    <div className="flex flex-col gap-[10px]">
                      <Textarea
                        id="feedback"
                        placeholder="What do you think about this subject?"
                        className="w-full"
                        required
                        onChange={(e) =>
                          setInput((prev) => ({
                            ...prev,
                            feedback: e.currentTarget.value,
                          }))
                        }
                      />
                    </div>
                  ) : null}
                  {showFeedback ? (
                    <div className="flex items-center gap-[10px]">
                      <Button
                        variant="secondary"
                        onClick={() => setShowFeedback(false)}
                        icon={{ icon: X }}
                      />

                      <Button
                        className="w-full"
                        type="button"
                        variant={"secondary"}
                        onClick={onRegenerate}
                        icon={{
                          icon: Send,
                        }}
                        isLoading={subject.regenerate.isLoading}
                        disabled={subject.regenerate.isLoading}
                      >
                        Send Feedback
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      type="button"
                      variant={"secondary"}
                      onClick={() => setShowFeedback(true)}
                      icon={{
                        icon: MessageSquarePlus,
                      }}
                    >
                      Give Feedback
                    </Button>
                  )}
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-[10px]">
                <Button
                  className="w-full"
                  type="button"
                  variant={"secondary"}
                  onClick={
                    state === "INITIATE"
                      ? () => {
                          setShowModal(false);
                          setInput(undefined);
                          setModules([]);
                        }
                      : () => setState("INITIATE")
                  }
                  disabled={subject.generate.isLoading}
                >
                  {state === "INITIATE" ? "Cancel" : "Change Subject"}
                </Button>
                <Button
                  className="w-full"
                  type="submit"
                  isLoading={
                    state === "INITIATE"
                      ? subject.generate.isLoading
                      : subject.create.isLoading
                  }
                >
                  {state === "INITIATE" ? "Generate" : "Confirm"}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Root>
        {subject.all.isLoading ? (
          <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : subject.all.data && subject.all.data.length == 0 ? (
          <div className="m-auto flex min-w-[300px] flex-col gap-[30px]">
            <div className="flex flex-col gap-[5px] text-center">
              <h1 className="text-xl font-medium">
                Start learn the unthinkable
              </h1>
              <p className="opacity-50">What do you want to learn today?</p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              type="button"
              size={"lg"}
              icon={{
                icon: BookPlus,
              }}
            >
              Learn Something
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-[20px]">
            <p className="opacity-50">{subject.all.data?.length} subjects</p>
            <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subject.all.data?.map((subject) => (
                <Link key={subject.id} href={`/subject/${subject.id}`}>
                  <div className="relative flex h-[350px] w-full flex-col overflow-hidden rounded-xl border-[1.5px]  border-black/5 bg-white text-left shadow-lg hover:cursor-pointer">
                    <Image
                      src={subject.cover}
                      alt={subject.name}
                      objectFit="cover"
                    />
                    <div className="flex flex-col gap-[5px] border-t-[1.5px] border-t-black/5 p-[16px]">
                      <div className="flex items-center gap-[5px] text-sm opacity-50">
                        <Book size={12} />
                        <p>{subject.modules.length} modules</p>
                      </div>
                      <h2 className="text-lg font-medium capitalize">
                        {subject.name}
                      </h2>
                      <div className="flex flex-col gap-[2px] text-sm">
                        <div className="flex items-center gap-[5px] opacity-50">
                          <Clock9 size={12} />
                          <p>
                            Last opened{" "}
                            {getRelativeTimeString(subject.updatedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-[5px] opacity-50">
                          <Calendar size={12} />
                          <p>
                            Created {getRelativeTimeString(subject.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
