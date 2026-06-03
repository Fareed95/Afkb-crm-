import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/60 bg-card p-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
