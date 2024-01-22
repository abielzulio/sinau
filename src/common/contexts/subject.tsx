import { type SubjectWithModulesAndVideo } from "@/server/db/query";
import { type ModuleWithVideo } from "@/server/db/query/module";
import { type Maybe, type ValueAndSet } from "@/type";
import { api } from "@/utils/api";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useSubjectRouter } from "../hooks/subject";

interface SubjectContextType {
  subject: ValueAndSet<Maybe<SubjectWithModulesAndVideo>>;
  selectedModule: Maybe<typeof ModuleWithVideo>;
  isLoading: boolean;
}

const SubjectContextImpl = createContext<SubjectContextType>({
  subject: {
    value: undefined,
    set: () => undefined,
  },
  selectedModule: undefined,
  isLoading: false,
});

export const useSubjectContext = () => useContext(SubjectContextImpl);

export const SubjectContextProvider = ({ children }: PropsWithChildren) => {
  const { data, isLoading } = useSubjectRouter();

  const [subject, setSubject] =
    useState<SubjectContextType["subject"]["value"]>(data);

  const [selectedModule, setSelectedModule] = useState<
    SubjectContextType["selectedModule"]
  >(subject?.modules?.find((x) => x.id === subject?.lastSelectedModuleId));

  const update = {
    subject: api.subject.update.useMutation(),
    module: api.module.update.useMutation(),
  };

  useEffect(() => {
    if (!data) return;
    setSubject(data);
  }, [data]);

  useEffect(() => {
    if (!subject) return;
    setSelectedModule(
      subject?.modules?.find((x) => x.id === subject?.lastSelectedModuleId),
    );
    if (data?.lastSelectedModuleId === subject?.lastSelectedModuleId) return;
    const timeoutUpdate = setTimeout(() => {
      update.subject.mutate({
        id: subject.id,
        data: {
          lastSelectedModuleId: subject.lastSelectedModuleId,
        },
      });
    }, 500);

    return () => clearTimeout(timeoutUpdate);
  }, [subject]);

  useEffect(() => {
    if (!subject?.id) return;
    update.subject.mutate({
      id: subject.id,
      data: {
        updatedAt: new Date(Date.now()),
      },
    });
  }, [subject?.id]);

  useEffect(() => {
    if (!selectedModule) return;

    const timeoutUpdate = setTimeout(() => {
      update.module.mutate({
        id: selectedModule.id,
        data: {
          notes: selectedModule.notes!,
        },
      });
    }, 1000);

    return () => clearTimeout(timeoutUpdate);
  }, [subject]);

  return (
    <SubjectContextImpl.Provider
      value={{
        subject: {
          value: data!,
          set: setSubject,
        },
        selectedModule,
        isLoading,
      }}
    >
      {children}
    </SubjectContextImpl.Provider>
  );
};
