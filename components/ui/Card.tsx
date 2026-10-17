import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

export default function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
