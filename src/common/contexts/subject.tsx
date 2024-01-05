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
  selectedModule: ValueAndSet<Maybe<ModuleWithVideo>>;
  isLoading: boolean;
}

const SubjectContextImpl = createContext<SubjectContextType>({
  subject: {
    value: undefined,
    set: () => undefined,
  },
  selectedModule: {
    value: undefined,
    set: () => undefined,
  },
  isLoading: false,
});

export const useSubjectContext = () => useContext(SubjectContextImpl);

export const SubjectContextProvider = ({ children }: PropsWithChildren) => {
  const { data, isLoading } = useSubjectRouter();

  const [subject, setSubject] =
    useState<SubjectContextType["subject"]["value"]>(data);
  const [selectedModule, setSelectedModule] = useState<
    SubjectContextType["selectedModule"]["value"]
  >(subject?.modules?.find((x) => x.id === subject?.lastSelectedModuleId));

  const update = api.subject.update.useMutation();

  useEffect(() => {
    if (typeof data === "undefined" || !data) return;
    setSubject(data);
  }, [data]);

  useEffect(() => {
    if (!subject) return;
    setSelectedModule(
      subject.modules?.find((x) => x.id === subject?.lastSelectedModuleId),
    );
    const timeoutUpdate = setTimeout(() => {
      if (subject.lastSelectedModuleId !== data?.lastSelectedModuleId) {
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
    if (!subject?.id) return;
    update.mutate({
      id: subject.id,
      data: {
        updatedAt: new Date(Date.now()),
      },
    });
  }, [subject?.id]);

  return (
    <SubjectContextImpl.Provider
      value={{
        subject: {
          value: data!,
          set: setSubject,
        },
        selectedModule: {
          value: selectedModule,
          set: setSelectedModule,
        },
        isLoading,
      }}
    >
      {children}
    </SubjectContextImpl.Provider>
  );
};
