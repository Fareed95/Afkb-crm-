import { PageHeader } from "@/components/shared/page-header";
import { DashboardOverview } from "@/components/dashboard/overview";
import { getDashboardSnapshot } from "@/lib/services/dashboard";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Daily performance, outstanding balances, and activity."
      />
      <DashboardOverview snapshot={snapshot} />
    </div>
  );
}
