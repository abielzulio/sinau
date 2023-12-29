import { toast } from "sonner";

export const handleClientError = (err: string) => {
  // TODO: Add axiom error handling
  // TODO: Add optional obj for axioms
  console.error(err);
  toast.error(err);
};
