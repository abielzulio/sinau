import { api } from "@/utils/api";
import { useRouter } from "next/router";
import useDocumentVisibility from "./ui/useDocumentVisibility";

const useFetchSubject = (id: string) => {
  const { data, isLoading, refetch } = api.subject.getById.useQuery({ id });
  const { push } = useRouter();

  useDocumentVisibility({
    onVisible: () => {
      if (data) return;
      // TODO: Router to 404
      void push("/subject");
    },
    deps: [data],
  });

  return {
    data,
    isLoading,
  };
};

export const useSubjectRouter = () => {
  const { query } = useRouter();

  const { subject_id } = query as { subject_id: string };

  const subject = useFetchSubject(subject_id);

  return {
    ...subject,
  };
};
