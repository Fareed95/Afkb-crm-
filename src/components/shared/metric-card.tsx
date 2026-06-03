import { formatCurrency } from "@/lib/utils/format";

export function MetricCard({
  label,
  value,
  tone = "default",
  isCurrency = false
}: {
  label: string;
  value: number;
  tone?: "default" | "accent" | "success";
  isCurrency?: boolean;
}) {
  const styles = {
    default: "text-foreground",
    accent: "text-primary",
    success: "text-emerald-500"
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className={`text-3xl font-bold tracking-tight ${styles[tone]}`}>
        {isCurrency ? formatCurrency(value) : value.toLocaleString("en-IN")}
      </span>
    </div>
  );
}
