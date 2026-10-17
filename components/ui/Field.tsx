import type { ComponentProps } from "react";
import { cn } from "../../utils/cn";

const control =
  "w-full rounded-md border-input bg-surface text-foreground shadow-xs focus:border-primary focus:ring-primary aria-invalid:border-danger";

// react 19 passes ref as a normal prop, so react-hook-form's register works as is
export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-10 px-3", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(control, "resize-none p-2", className)}
      {...props}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(control, "h-10 cursor-pointer text-sm", className)}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label className={cn("text-sm font-semibold", className)} {...props} />
  );
}

// renders nothing without a message, so forms don't reserve empty space
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-danger">{message}</p>;
}
