import useDeleteModal from "@/common/components/delete-modal";
import * as Avatar from "@/common/components/ui/avatar";
import { Button } from "@/common/components/ui/button";
import * as Dropdown from "@/common/components/ui/dropdown";
import { handleClientError } from "@/common/components/ui/error";
import { Image } from "@/common/components/ui/image";
import { WithSubjectType, withSubject } from "@/common/helpers/ssr";
import useRendered from "@/common/hooks/useRendered";
import { cn } from "@/utils";
import { api } from "@/utils/api";
import {
  Book,
  Lock,
  LogOut,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  ScrollText,
  Trash,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export default function SubjectItemPage({
  subject: data,
  user,
}: WithSubjectType) {
  const { push } = useRouter();
  const [subject, setSubject] = useState({
    ...data,
    lastActiveModuleId: data.lastActiveModuleId ?? data.modules[0]?.id,
    lastSelectedModuleId: data.lastSelectedModuleId ?? data.modules[0]?.id,
  });

  const [selectedModule, setSelectedModule] = useState(() =>
    subject.modules.find((x) => x.id === subject.lastSelectedModuleId),
  );

  const [showModules, setShowModules] = useState(true);

  const [showQuiz, setShowQuiz] = useState(false);

  const isRendered = useRendered();

  const update = api.subject.update.useMutation();

  const _delete = api.subject.delete.useMutation({
    onSuccess: async () => {
      await push("/subject");
    },
    onError: (error) => {
      handleClientError(error.message);
    },
  });

  const { component: renderDeleteModal, show: showDeleteModal } =
    useDeleteModal({
      noun: `"${subject.name}" subject`,
      isLoading: _delete.isLoading,
      callback: {
        onDelete: async () => {
          await _delete.mutateAsync({ id: subject.id });
        },
        onDone: async () => {
          await push("/subject");
        },
      },
    });

  useEffect(() => {
    setSelectedModule(
      subject.modules.find((x) => x.id === subject.lastSelectedModuleId),
    );
    const timeoutUpdate = setTimeout(() => {
      if (subject.lastSelectedModuleId !== data.lastSelectedModuleId) {
        update.mutate({
          id: subject.id,
          data: {
            lastSelectedModuleId: subject.lastSelectedModuleId,
          },
        });
      }
    }, 500);

    return () => clearTimeout(timeoutUpdate);
  }, [subject]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    update.mutate({
      id: subject.id,
      data: {
        updatedAt: new Date(Date.now()),
      },
    });
  }, []);

  return (
    <>
      {renderDeleteModal()}
      <nav className="flex flex-row items-center justify-between bg-off-white px-[24px] py-[18px]">
        <Link href="/subject" className="flex flex-row items-center gap-[10px]">
          <Image
            src="/brand/sinau-black.svg"
            alt="Sinau Logo"
            className="h-[18px] w-[18px]"
          />
          <p className="font-medium">Sinau</p>
        </Link>
        <div className="flex flex-row items-center gap-[15px]">
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Avatar.Root>
                <Avatar.Image src={user.image!} alt="Avatar" />
                <Avatar.Fallback>
                  {(user?.name ?? user.email?.split("@"))?.[0]}
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

      <main className="min-w-screen flex h-[calc(100vh-75px)] flex-col border-t-[1px] border-black/10">
        <section className="flex items-center justify-between px-[24px] py-[18px]">
          <div className="flex flex-col gap-[10px]">
            <h1 className="text-2xl font-medium capitalize">{subject?.name}</h1>
            <div className="flex items-center gap-[5px] text-sm opacity-50">
              <Book size={12} />
              <p>{subject?.modules.length} modules</p>
            </div>
          </div>
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => showDeleteModal(true)}
            icon={{ icon: Trash }}
          >
            Delete
          </Button>
        </section>
        <section className="flex h-[calc(100vh-200px)] border-t-[1px] border-t-black/10">
          {showModules ? (
            <div className="flex w-fit flex-col gap-[10px] overflow-y-auto border-r-[1px] border-r-black/10 p-[12px]">
              {subject?.modules.map((module, id) => {
                return (
                  <button
                    key={module.id}
                    type="button"
                    className={cn(
                      "flex items-center justify-between rounded-md p-[12px] transition",
                      {
                        "bg-black/5":
                          subject.lastSelectedModuleId === module.id,
                      },
                      {
                        "hover:bg-off-white":
                          subject.lastSelectedModuleId !== module.id,
                      },
                    )}
                    onClick={
                      /*                    subject.lastActiveModuleId !== module.id
                      ? undefined
                      : */ () =>
                        setSubject((prev) => ({
                          ...prev,
                          lastSelectedModuleId: module.id,
                        }))
                    }
                  >
                    <div className="flex items-start gap-[10px]">
                      <p className="w-[20px] opacity-50">#{id + 1}</p>
                      <p className="w-[250px] text-left">{module.title}</p>
                    </div>

                    {subject.lastActiveModuleId === module.id ? null : (
                      <div className="w-[20px]">
                        <Lock size={12} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : null}
          <div
            className={cn(
              "flex h-full flex-col gap-[10px] overflow-y-auto",
              {
                "w-[calc(100vw-300px)]": showModules,
              },
              {
                "w-full": !showModules,
              },
            )}
          >
            <div className="flex h-fit w-full items-center border-b-[1px] border-black/10 p-[16px]">
              <div className="flex w-fit items-start gap-[10px]">
                <Button
                  icon={{
                    icon: showModules ? PanelRightOpen : PanelRightClose,
                  }}
                  type="button"
                  variant={"secondary"}
                  onClick={() => setShowModules((prev) => !prev)}
                />
                <div className="flex w-4/5 flex-col gap-[5px]">
                  <h2 className="text-xl font-medium">
                    {selectedModule?.title}
                  </h2>
                  <p className="text-sm opacity-50">
                    {selectedModule?.overview}
                  </p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-[10px]">
                <Button
                  icon={{ icon: ScrollText }}
                  type="button"
                  onClick={() => setShowQuiz((prev) => !prev)}
                >
                  Take a Quiz
                </Button>
                <Button
                  variant="secondary"
                  icon={{ icon: MessageSquare }}
                  type="button"
                >
                  Ask AI
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col p-[16px]">
              {isRendered ? (
                <ReactPlayer
                  image={selectedModule?.video.cover}
                  pip
                  controls
                  style={{ height: "600px", width: "100%" }}
                  url={selectedModule?.video.url}
                />
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = withSubject();
