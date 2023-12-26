import { cn } from "@/utils";
import React from "react";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-gray-400", className)}
      {...props}
    />
  );
});

Skeleton.displayName = "Skeleton";

export { Skeleton };
