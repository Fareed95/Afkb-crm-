import { PageHeader } from "@/components/shared/page-header";
import { AdhocForm } from "@/components/forms/adhoc-form";
import { AdhocTable } from "@/components/tables/adhoc-table";
import { listAdhocReceipts } from "@/lib/services/adhoc";
import { ClientTabs } from "@/components/ui/client-tabs";
import { PlusCircle, List } from "lucide-react";

export default async function AdhocPage() {
  const receipts = await listAdhocReceipts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Adhoc Customers"
        description="Instant receipts for walk-in customers."
      />
      <ClientTabs 
        tabs={[
          {
            id: "list",
            label: "Adhoc History",
            icon: <List className="h-4 w-4" />,
            content: (
              <div className="section-card">
                <AdhocTable data={receipts} />
              </div>
            )
          },
          {
            id: "create",
            label: "Create Adhoc Bill",
            icon: <PlusCircle className="h-4 w-4" />,
            content: (
              <div className="max-w-2xl">
                <AdhocForm />
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
