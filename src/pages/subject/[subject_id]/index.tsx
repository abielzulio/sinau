import useDeleteModal from "@/common/components/delete-modal";
import NavigationBar from "@/common/components/navigation-bar";
import { Button } from "@/common/components/ui/button";
import * as Command from "@/common/components/ui/command";
import { handleClientError } from "@/common/components/ui/error";
import Markdown from "@/common/components/ui/markdown";
import * as Popover from "@/common/components/ui/popover";
import * as Resizeable from "@/common/components/ui/resizeable";
import { Skeleton } from "@/common/components/ui/skeleton";
import { TRIGGER_LOADING_STATUS } from "@/common/constant";
import {
  SubjectContextProvider,
  useSubjectContext,
} from "@/common/contexts/subject";
import { withSubject } from "@/common/helpers/ssr";
import useReadingMaterialHeight from "@/common/hooks/ui/useReadingMaterialHeight";
import useRendered from "@/common/hooks/ui/useRendered";
import { cn } from "@/utils";
import { api } from "@/utils/api";
import { useEventDetails } from "@trigger.dev/react";
import { Book, Check, ChevronsUpDown, Loader, ScrollText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const markdown = `## Introduction\n\nIn this module, we will explore the fundamental skills and responsibilities of babysitting. Whether you are new to babysitting or looking to enhance your existing knowledge, this reading material will provide you with valuable insights into being a competent and reliable babysitter. We will cover important topics such as safety, communication, basic child care techniques, and how to market yourself as a babysitter. Let's dive in!\n\n## What Makes a Great Babysitter?\n\nBeing a great babysitter goes beyond just showing up for the job. It involves being prepared, responsible, and trustworthy. Here are some key characteristics of an amazing babysitter:\n\n1. **Preparedness**: Arriving early and being organized is crucial. Parents appreciate babysitters who are punctual and ready to take on their responsibilities.\n\n2. **CPR and First Aid**: Knowing CPR and basic first aid is essential for handling emergencies and ensuring the safety of the children under your care.\n\n3. **Knowledge of the Child**: Take note of important facts about the child you are babysitting, such as allergies, medical conditions, and specific instructions from the parents. This information will help you provide appropriate care and respond effectively in case of an emergency.\n\n4. **Active and Fun**: Engage with the child by playing games and being creative. A babysitter who can come up with their own activities keeps children entertained and happy.\n\n5. **Establishing Boundaries**: Children thrive on routine and structure. Set meal times, bedtime, and limits on screen time to provide a sense of stability and security.\n\n6. **Watchful and Aware**: Stay attentive and minimize distractions. Being vigilant helps prevent accidents and ensures the well-being of the children.\n\n7. **Comforting and Supportive**: Children may experience moments of fear or homesickness. Being able to comfort and support them emotionally is an important aspect of babysitting.\n\n8. **Flexibility**: Children can be unpredictable, so be adaptable and open to changes in plans or activities.\n\n## Fun Activities for Babysitting\n\nEngaging children in fun activities is an essential part of babysitting. Here are some ideas for both indoor and outdoor activities:\n\n**Outdoor Activities:**\n- Playground fun\n- Hide and seek\n- Chalk coloring\n- Bike riding\n- Tag\n- Hopscotch\n- Backyard bowling\n\n**Indoor Activities:**\n- Crafts\n- Board games\n- Dance parties\n- Puzzles\n- Coloring\n- Movies (in moderation)\n\nRemember, the key is to keep the children entertained and engaged while ensuring their safety.\n\n## Safety Precautions\n\nAs a babysitter, it is crucial to be aware of potential hazards and take necessary precautions to ensure the safety of the children. Here are some safety tips to keep in mind:\n\n1. **Choking Hazards**: Be cautious of foods that pose a choking risk, such as hot dogs, nuts, grapes, popcorn, and chewing gum. Cut foods into appropriate sizes and avoid small non-food items that can be swallowed.\n\n2. **Household Hazards**: Regularly inspect the home for potential dangers. Secure outlets, use baby gates for young children, lock away cleaning products, be cautious of hot surfaces, and remove or secure any items that could cause harm.\n\n3. **First Aid Preparedness**: Always carry a first aid kit with essential items such as bandages, gauze, tweezers, cold packs, and antiseptic wipes. Familiarize yourself with the proper use of these items and consider getting CPR certified for additional preparedness.\n\n4. **Allergies and Medications**: Take note of any allergies or medical conditions the child may have. Be aware of the necessary steps to take in case of an allergic reaction and know how to administer any required medications.\n\n## Marketing Yourself as a Babysitter\n\nOnce you are prepared and qualified as a babysitter, it's important to market yourself effectively. Here are some strategies to consider:\n\n1. **Online Platforms**: Utilize websites like care.com to create a profile and connect with potential clients.\n\n2. **Flyers and Newsletters**: Create eye-catching flyers and distribute them in your neighborhood or local community newsletters.\n\n3. **Word of Mouth**: Reach out to friends, family, and acquaintances who may be in need of a babysitter. Personal recommendations can go a long way.\n\n4. **Business Cards**: Design and distribute business cards that include your contact information and a brief description of your services.\n\n## Setting Your Babysitting Rates\n\nDetermining your babysitting rates can depend on various factors. Here are some considerations:\n\n- **Number of Children**: The more children you are responsible for, the higher your rate may be.\n\n- **Travel Distance**: If the babysitting job requires significant travel from your home, you may consider charging extra for transportation costs.\n\n- **Weekend vs. Weekday**: Rates may differ for weekend nights compared to weekday nights.\n\n- **Duration of Job**: Full-day babysitting may warrant a different rate than evening-only jobs.\n\n- **Experience**: If you have extensive experience or specialized skills, you may charge a higher rate.\n\nRemember to be fair and competitive with your rates while considering the value you provide as a responsible and qualified babysitter.\n\n## Conclusion\n\nBabysitting requires a combination of skills, responsibility, and attentiveness. By being prepared, engaging with the children, prioritizing safety, and effectively marketing yourself, you can become a trusted and sought-after babysitter. Remember to always prioritize the well-being of the children under your care and continuously enhance your knowledge and skills in child care. Happy babysitting!"
`;

export default function SubjectItemPage() {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <SubjectContextProvider>
      <NavigationBar />
      <main
        className="min-w-screen flex min-h-screen flex-col border-t-[1px] border-black/10 pt-[65px]"
        id="subject-wrapper"
      >
        <Header />
        <SelectedModule />
      </main>
    </SubjectContextProvider>
  );
}

const Header = () => {
  const { push } = useRouter();

  const {
    subject: { value: subject },
  } = useSubjectContext();

  const event = useEventDetails(subject?.id);

  const _delete = api.subject?.delete.useMutation({
    onSuccess: async () => {
      await push("/subject");
    },
    onError: (error) => {
      handleClientError(error.message);
    },
  });

  const { component: renderDeleteModal, show: showDeleteModal } =
    useDeleteModal({
      noun: `"${subject?.name}" subject`,
      isLoading: _delete.isLoading,
      callback: {
        onDelete: async () => {
          if (!subject?.id) return;
          await _delete.mutateAsync({ id: subject?.id });
        },
        onDone: async () => {
          await push("/subject");
        },
      },
    });

  return (
    <>
      {renderDeleteModal()}
      <section
        className="flex items-center justify-between border-t-[1px] border-t-black/10 px-[24px] py-[18px]"
        id="subject-header"
      >
        <div className="flex flex-col gap-[10px]">
          <h1 className="text-2xl font-medium capitalize">{subject?.name}</h1>
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-[5px] text-sm opacity-50">
              <Book size={12} />
              <p>{subject?.modules?.length} modules</p>
            </div>
            {event.data?.runs.some((run) =>
              run.status.includes(TRIGGER_LOADING_STATUS),
            ) ? (
              <div className="flex items-center gap-[5px] rounded-sm bg-black/[0.05] px-[5px]">
                <Loader size={12} className="animate-spin" />
                <p className="text-[12px] opacity-50">Preparing</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          {/*           <Button
            variant={"secondary"}
            type="button"
            onClick={() => showDeleteModal(true)}
            icon={{ icon: Trash }}
          >
            Delete
          </Button> */}
        </div>
      </section>
    </>
  );
};

const SelectedModule = () => {
  const { selectedModule: module } = useSubjectContext();

  const {
    subject: { value: subject, set: setSubject },
    selectedModule,
  } = useSubjectContext();

  /*   const [selectedModule, setSelectedModule] = useState(value);

  useEffect(() => {
    if (!selectedModule || !value) return;

    const timeoutUpdate = setTimeout(() => {
      if (value?.notes !== selectedModule?.notes && selectedModule.notes) {
        update.mutate({
          id: selectedModule.id,
          data: {
            notes: selectedModule.notes,
          },
        });
      }
    }, 500);

    return () => clearTimeout(timeoutUpdate);
  }, [selectedModule]);
 */
  const [notes, setNotes] = useState(selectedModule?.notes ?? "");
  const [open, setOpen] = useState(false);
  const readingHeight = useReadingMaterialHeight([selectedModule]);
  const isRendered = useRendered();

  useEffect(() => {
    if (!notes) return;
    if (notes === selectedModule?.notes) return;
    setSubject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        modules: prev.modules.map((module) => {
          if (module.id !== selectedModule?.id) return module;
          return {
            ...module,
            notes,
          };
        }),
      };
    });
  }, [notes]);

  useEffect(() => {
    const remoteNotes = selectedModule?.notes;
    if (!remoteNotes) {
      setNotes("");
      return;
    }
    if (remoteNotes === notes) return;
    setNotes(remoteNotes);
  }, [selectedModule?.notes]);

  return (
    <div className="flex h-full w-full flex-col">
      <div
        className="flex h-fit w-full items-center border-y-[1px] border-black/10 px-[24px] py-[16px]"
        id="module-header"
      >
        <div className="relative flex w-full items-center gap-[15px]">
          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
              <Button
                variant={"secondary"}
                role="combobox"
                aria-expanded={open}
                className="my-auto"
                icon={{ icon: ChevronsUpDown }}
              />
            </Popover.Trigger>
            <Popover.Content
              className="w-full p-0"
              align="start"
              sideOffset={14}
            >
              <Command.Root>
                <Command.Input placeholder={`Search module...`} />
                <Command.Empty>No module found.</Command.Empty>
                <Command.Group>
                  {(subject?.modules
                    ? subject?.modules
                        ?.sort((a, b) => a.order - b.order)
                        .map((module) => ({
                          label: module.title,
                          value: module.title,
                        }))
                    : []
                  ).map((item, id) => (
                    <Command.Item
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        setSubject((prev) => {
                          if (!prev) return prev;
                          const selected = prev.modules.find(
                            (module) =>
                              module.title.toLocaleLowerCase() == currentValue,
                          )?.id;
                          if (!selected) return prev;
                          return {
                            ...prev,
                            lastSelectedModuleId: selected,
                          };
                        });
                        setOpen(false);
                      }}
                      className="flex items-center gap-[8px]"
                    >
                      <Check
                        size={16}
                        className={cn(
                          selectedModule?.title === item.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="flex items-center justify-between gap-[4px]">
                        <span className="mr-auto opacity-50">{id + 1}.</span>
                        <span>{item.label}</span>
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
          <div className="sticky top-[100px] flex w-full flex-col items-center gap-[15px] sm:ml-auto sm:flex-row">
            <div className="flex w-full flex-col gap-[5px]">
              <div className="flex items-center">
                <h2 className="text-xl font-medium">{module?.title}</h2>
              </div>
              <p className="text-sm opacity-50">{module?.overview}</p>
            </div>

            <div className="flex w-full items-center gap-[10px] sm:w-fit">
              <Button
                icon={{ icon: ScrollText }}
                className="my-auto w-full sm:w-[130px]"
                type="button"
                /*             onClick={() => showQuiz.set((prev) => !prev)} */
              >
                Take Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Resizeable.Group
        style={{ height: `${readingHeight}px` }}
        direction="horizontal"
        className="w-screen"
      >
        <Resizeable.Panel defaultSize={25}>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
            className="h-full w-full p-[16px] text-sm placeholder:text-sm"
            placeholder={`Add your note about "${selectedModule?.title}" here`}
          />
        </Resizeable.Panel>
        <Resizeable.Handle withHandle />
        <Resizeable.Panel style={{ overflowY: "scroll" }} defaultSize={50}>
          <div className="flex flex-col gap-[18px] p-[16px]">
            {isRendered ? (
              <ReactPlayer
                image={module?.video.cover}
                pip
                controls
                style={{ height: "600px", width: "100%" }}
                url={module?.video.url}
              />
            ) : null}
            {!module?.reading ? (
              <div className="my-[15px] flex flex-col gap-[15px] opacity-50">
                <Skeleton className="h-[20px] w-full rounded-md" />
                <Skeleton className="h-[20px] w-full rounded-md" />
                <Skeleton className="h-[20px] w-full rounded-md" />
                <Skeleton className="h-[20px] w-full rounded-md" />
              </div>
            ) : (
              <article className="prose">
                <Markdown text={module?.reading} />
              </article>
            )}
            {module?.references && module?.references.length > 0 ? (
              <div className="flex flex-col gap-[5px]">
                <p className="font-semibold">References to Read</p>
                {JSON.parse(module.references).map(
                  (
                    reference: { url: string; id: string; title: string },
                    id: number,
                  ) => (
                    <Link
                      href={reference.url}
                      key={reference.id}
                      target="_blank"
                    >
                      {id + 1}.
                      <span className="ml-[4px] underline">
                        {reference.title}
                      </span>
                    </Link>
                  ),
                )}
              </div>
            ) : null}
          </div>
        </Resizeable.Panel>
        <Resizeable.Handle withHandle />
        <Resizeable.Panel defaultSize={25}></Resizeable.Panel>
      </Resizeable.Group>
    </div>
  );
};

export const getServerSideProps = withSubject();
