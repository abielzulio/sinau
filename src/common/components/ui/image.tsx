import NextImage from "next/image";
import React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/utils";

interface ImageProps
  extends Omit<
    Parameters<typeof NextImage>[0],
    "fill" | "width" | "height" | "style" | "objectFit"
  > {
  objectFit?: React.CSSProperties["objectFit"];
}

function Image({
  className,
  src,
  objectFit = "contain",
  ...props
}: ImageProps) {
  const isMounted = React.useRef(false);

  if (!isMounted || !src)
    return <Skeleton className={cn("h-full w-full", className)} />;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <NextImage {...props} fill style={{ objectFit }} src={src} />
    </div>
  );
}

export { Image };
