import { useEffect } from "react";

const useDocumentVisibility = (props: {
  onVisible?: () => Promise<void>;
  onHidden?: () => Promise<void>;
  deps?: Array<never>;
}) => {
  useEffect(() => {
    const onFocus = () => {
      void props.onVisible?.();
    };
    const onBlur = () => {
      void props.onHidden?.();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onBlur();
      } else {
        onFocus();
      }
    };

    if ("hidden" in document) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      props.onVisible ? document.addEventListener("focus", onFocus) : undefined;
      props.onHidden ? document.addEventListener("blur", onFocus) : undefined;
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      props.onVisible
        ? document.removeEventListener("focus", onFocus)
        : undefined;
      props.onHidden
        ? document.removeEventListener("blur", onFocus)
        : undefined;
    };
  }, [props]);
};

export default useDocumentVisibility;
