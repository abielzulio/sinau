import { useEffect, useState } from "react";

const useRendered = (delay?: number) => {
  const [isRendered, setRendered] = useState(false);

  useEffect(() => {
    if (!delay) {
      setRendered(true);
      return;
    }

    const timeout = setTimeout(() => {
      setRendered(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  return isRendered;
};

export default useRendered;
