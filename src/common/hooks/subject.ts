import { api } from "@/utils/api";
import { useRouter } from "next/router";
import useDocumentVisibility from "./ui/useDocumentVisibility";

const useFetchSubject = (id: string) => {
  const { data, isLoading } = api.subject.getById.useQuery({ id });
  const { push } = useRouter();

  useDocumentVisibility({
    onVisible: async () => {
      if (data) return;
      // TODO: Router to 404
      await push("/subject");
    },
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
