import { cn } from "@/lib/utils/cn";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border/60 bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
