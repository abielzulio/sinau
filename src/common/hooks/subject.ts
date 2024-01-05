import { api } from "@/utils/api";
import { useRouter } from "next/router";

const useFetchSubject = (id: string) => {
  const { data, isLoading } = api.subject.getById.useQuery({ id });

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
