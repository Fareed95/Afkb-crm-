import { PageHeader } from "@/components/shared/page-header";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { InvoiceTable } from "@/components/tables/invoice-table";
import { listInvoices } from "@/lib/services/invoices";
import { listShops } from "@/lib/services/shops";
import { ClientTabs } from "@/components/ui/client-tabs";
import { PlusCircle, List } from "lucide-react";

export default async function InvoicesPage() {
  const [shops, invoices] = await Promise.all([
    listShops(),
    listInvoices()
  ]);

  return (
    <div className="space-y-8 animate-in-fade">
      <PageHeader
        title="Invoices"
        description="Generate official billing invoices from uninvoiced work entries."
      />
      <ClientTabs 
        tabs={[
          {
            id: "list",
            label: "Invoice History",
            icon: <List className="h-4 w-4" />,
            content: <InvoiceTable data={invoices} />
          },
          {
            id: "create",
            label: "Generate Invoice",
            icon: <PlusCircle className="h-4 w-4" />,
            content: (
              <div className="max-w-2xl">
                <InvoiceForm shops={shops} />
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
