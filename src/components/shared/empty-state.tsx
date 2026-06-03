import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
