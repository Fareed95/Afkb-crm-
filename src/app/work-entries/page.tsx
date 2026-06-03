import { PageHeader } from "@/components/shared/page-header";
import { WorkEntryForm } from "@/components/forms/work-entry-form";
import { WorkEntryTable } from "@/components/tables/work-entry-table";
import { listShops } from "@/lib/services/shops";
import { listWorkEntries } from "@/lib/services/work-entries";

export default async function WorkEntriesPage() {
  const [shops, entries] = await Promise.all([
    listShops(),
    listWorkEntries()
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work Entries"
        description="Record daily garments processed for each shop."
      />
      <WorkEntryForm shops={shops} />
      <div className="section-card mt-6 border-t-0 rounded-b-xl rounded-t-none border-x-0 shadow-none bg-transparent pt-6">
        <h2 className="text-lg font-medium mb-4">Recent Entries</h2>
        <WorkEntryTable data={entries} />
      </div>
    </div>
  );
}
