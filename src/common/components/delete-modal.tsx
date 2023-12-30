import { Button } from "@/common/components/ui/button";
import * as Dialog from "@/common/components/ui/dialog";
import { useState } from "react";

const useDeleteModal = (props: {
  noun: string;
  isLoading?: boolean;
  callback: {
    onDelete: () => Promise<void>;
    onDone: () => Promise<void> | void;
  };
}) => {
  const [isShow, setShow] = useState(false);

  const onDelete = async () => {
    await props.callback.onDelete();
    await props.callback.onDone();
    setShow(false);
  };

  const component = () => (
    <Dialog.Root open={isShow} onOpenChange={(open) => setShow(open)}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete Confirmation</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete {props.noun}?
          </Dialog.Description>
        </Dialog.Header>
        <div className="flex items-center justify-between gap-[10px]">
          <Button
            className="w-full"
            type="button"
            variant={"secondary"}
            onClick={() => setShow(false)}
            disabled={props.isLoading}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            variant={"destructive"}
            type="button"
            onClick={onDelete}
            isLoading={props.isLoading}
          >
            Delete
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
  return {
    component,
    show: setShow,
  };
};

export default useDeleteModal;
