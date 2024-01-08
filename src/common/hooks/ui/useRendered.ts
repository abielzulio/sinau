import { useEffect, useState } from "react";

const useRendered = (delay?: number) => {
  const [isRendered, setRendered] = useState(false);

  useEffect(() => {
    if (!delay) {
      const timeout = setTimeout(() => {
        setRendered(true);
      }, 10);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setRendered(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  return isRendered;
};

export default useRendered;
