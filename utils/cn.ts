// joins class names and skips falsy ones, for conditional classes
export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");
