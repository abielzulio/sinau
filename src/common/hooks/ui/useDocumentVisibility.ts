import { useEffect } from "react";

const useDocumentVisibility = (props: {
  onVisible?: () => Promise<void>;
  onHidden?: () => Promise<void>;
  deps?: Array<unknown>;
}) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        void props.onHidden?.();
      } else {
        void props.onVisible?.();
      }
    };

    if ("hidden" in document) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [props]);
};

export default useDocumentVisibility;
