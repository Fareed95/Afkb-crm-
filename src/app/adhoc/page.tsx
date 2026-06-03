import { PageHeader } from "@/components/shared/page-header";
import { AdhocForm } from "@/components/forms/adhoc-form";
import { AdhocTable } from "@/components/tables/adhoc-table";
import { listAdhocReceipts } from "@/lib/services/adhoc";

export default async function AdhocPage() {
  const receipts = await listAdhocReceipts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Adhoc Customers"
        description="Instant receipts for walk-in customers."
      />
      <AdhocForm />
      <div className="section-card">
        <AdhocTable data={receipts} />
      </div>
    </div>
  );
}
