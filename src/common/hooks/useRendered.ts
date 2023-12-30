import { useEffect, useState } from "react";

const useRendered = () => {
  const [isRendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(true);
  }, []);

  return isRendered;
};

export default useRendered;
