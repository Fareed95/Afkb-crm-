export function formatCurrency(amount: number) {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);

  return `INR ${formatted}`;
}

export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}
