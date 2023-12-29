import * as Accordion from "@/common/components/ui/accordion";
import * as Avatar from "@/common/components/ui/avatar";
import { Button } from "@/common/components/ui/button";
import * as Dialog from "@/common/components/ui/dialog";
import * as Dropdown from "@/common/components/ui/dropdown";
import { handleClientError } from "@/common/components/ui/error";
import { Image } from "@/common/components/ui/image";
import { Input } from "@/common/components/ui/input";
import { Textarea } from "@/common/components/ui/textarea";
import { withAuth, type WithAuthType } from "@/common/helpers/ssr";
import { type Module } from "@/type";
import { api } from "@/utils/api";
import { getRelativeTimeString } from "@/utils/date";
import {
  Book,
  BookPlus,
  Calendar,
  Clock9,
  LogOut,
  MessageSquarePlus,
  Send,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function SubjectsPage(props: WithAuthType) {
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [input, setInput] = useState<{
    subject?: string;
    feedback?: string;
  }>();
  const [modules, setModules] = useState<Module[]>([]);
  const [state, setState] = useState<"INITIATE" | "CONFIRMATION">("INITIATE");

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
    all: api.subject.getAll.useQuery({ page: 0 }),
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!input?.subject) return;
    await subject.generate.mutateAsync({ subject: input.subject });
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
      <nav className="flex flex-row items-center justify-between px-[24px] py-[18px]">
        <div className="flex flex-row items-center gap-[10px]">
          <Image
            src="/brand/sinau-black.svg"
            alt="Sinau Logo"
            className="h-[18px] w-[18px]"
          />
          <p className="font-medium">Sinau</p>
        </div>
        <div className="flex flex-row items-center gap-[15px]">
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
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Avatar.Root>
                <Avatar.Image src={props.user.image!} alt="Avatar" />
                <Avatar.Fallback>
                  {(props.user.name ?? props.user.email?.split("@"))?.[0]}
                </Avatar.Fallback>
              </Avatar.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align="end" sideOffset={10}>
              <Dropdown.Item
                className="flex items-center gap-[10px] hover:cursor-pointer"
                onClick={() => void signOut()}
              >
                <LogOut size={14} />
                Sign out
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      </nav>
      <main className="min-w-screen flex min-h-screen flex-col p-[24px]">
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
                  <Accordion.Root type="single" collapsible>
                    {modules.map((module, id) => (
                      <Accordion.Item value={module.title} key={id}>
                        <Accordion.Trigger>
                          #{id + 1} {module.title}
                        </Accordion.Trigger>
                        <Accordion.Content className="opacity-50">
                          {module.overview}
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
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
                  isLoading={subject.generate.isLoading}
                >
                  {state === "INITIATE" ? "Generate" : "Confirm"}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Root>
        {subject.all.data && subject.all.data.length == 0 ? (
          <div className="m-auto flex min-w-[300px] flex-col gap-[30px]">
            <div className="flex flex-col gap-[5px] text-center">
              <h1 className="text-xl font-medium">
                Start learn the unthinkable
              </h1>
              <p className="opacity-50">What do you want to learn today?</p>
            </div>
            <form
              className="flex w-full flex-col gap-[20px] text-left"
              onSubmit={onSubmit}
            >
              <div className="flex flex-col gap-[10px]">
                <Input
                  id="subject"
                  placeholder="Thermodynamics"
                  className="w-full"
                  type="text"
                  required
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      subject: e.currentTarget.value,
                    }))
                  }
                />
              </div>
              <Button
                className="w-full"
                type="submit"
                disabled={
                  input?.subject == null ||
                  input.subject == "" ||
                  subject.generate.isLoading
                }
                isLoading={subject.generate.isLoading}
              >
                {input?.subject == null || input.subject == ""
                  ? "Type to Start"
                  : `Learn ${input.subject}`}
              </Button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subject.all.data?.map((subject) => (
              <Link key={subject.id} href={`/subject/${subject.id}`}>
                <div className="relative flex h-[350px] w-full flex-col overflow-hidden rounded-xl border-[1.5px]  border-black/5 bg-white text-left shadow-lg hover:cursor-pointer">
                  <Image src={subject.cover} alt={subject.name} />
                  <div className="flex flex-col gap-[5px] border-t-[1.5px] border-t-black/5 p-[16px]">
                    <div className="flex items-center gap-[5px] text-sm opacity-50">
                      <Book size={12} />
                      <p>{subject.moduleCount} modules</p>
                    </div>
                    <h2 className="text-lg font-medium capitalize">
                      {subject.name}
                    </h2>
                    <div className="flex flex-col gap-[2px] text-sm">
                      <div className="flex items-center gap-[5px] opacity-50">
                        <Clock9 size={12} />
                        <p>
                          Created {getRelativeTimeString(subject.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-[5px] opacity-50">
                        <Calendar size={12} />
                        <p>
                          Last opened {getRelativeTimeString(subject.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps = withAuth();
