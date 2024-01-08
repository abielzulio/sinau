import { useEffect, useState } from "react";

const useReadingMaterialHeight = (deps: unknown[]) => {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      const subjectWrapper = document.getElementById("subject-wrapper");
      const subjectHeader = document.getElementById("subject-header");
      const moduleHeader = document.getElementById("module-header");

      if (!subjectWrapper || !subjectHeader || !moduleHeader) return;

      const paddingTop = window
        .getComputedStyle(subjectWrapper)
        .getPropertyValue("padding-top");

      const windoHeight = window.innerHeight;

      const readingHeight =
        windoHeight -
        subjectHeader.clientHeight -
        moduleHeader.clientHeight -
        parseFloat(paddingTop) * 1.0625;

      setHeight(readingHeight);
    };
    if (typeof window !== "undefined") {
      handleResize();
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [...deps]);

  return height;
};

export default useReadingMaterialHeight;
