import * as Avatar from "@/common/components/ui/avatar";
import { Button } from "@/common/components/ui/button";
import * as Dialog from "@/common/components/ui/dialog";
import * as Dropdown from "@/common/components/ui/dropdown";
import { Image } from "@/common/components/ui/image";
import { Input } from "@/common/components/ui/input";
import { withAuth, type WithAuthType } from "@/common/helpers/ssr";
import { api } from "@/utils/api";
import { getRelativeTimeString } from "@/utils/date";
import { Book, BookPlus, Calendar, Clock9, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SubjectsPage(props: WithAuthType) {
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [data, setData] = useState<{ subject: string }>();

  const subject = {
    create: api.subject.create.useMutation(),
    all: api.subject.getAll.useQuery({ page: 0 }),
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!data) return;
    await subject.create.mutateAsync({ subject: data.subject });
    await subject.all.refetch();
    setData(undefined);
    setShowModal(false);
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
              <Dialog.Title>Learn New Subject</Dialog.Title>
              <Dialog.Description>
                What do you want to learn today?
              </Dialog.Description>
            </Dialog.Header>
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
                    setData((prev) => ({
                      ...prev,
                      subject: e.currentTarget.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-[10px]">
                <Button
                  className="w-full"
                  type="button"
                  variant={"secondary"}
                  onClick={() => setShowModal(false)}
                  disabled={subject.create.isLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full"
                  type="submit"
                  isLoading={subject.create.isLoading}
                >
                  Create
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
                    setData((prev) => ({
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
                  data?.subject == null ||
                  data.subject == "" ||
                  subject.create.isLoading
                }
                isLoading={subject.create.isLoading}
              >
                {data?.subject == null || data.subject == ""
                  ? "Type to Start"
                  : `Learn ${data.subject}`}
              </Button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-[30px]">
            {subject.all.data?.map((subject) => (
              <Link key={subject.id} href={`/subject/${subject.id}`}>
                <div className="relative flex h-[300px] w-full flex-col overflow-hidden rounded-xl border-[1.5px]  border-black/5 bg-white text-left shadow-lg hover:cursor-pointer">
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
