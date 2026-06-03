import { PageHeader } from "@/components/shared/page-header";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { InvoiceTable } from "@/components/tables/invoice-table";
import { listInvoices } from "@/lib/services/invoices";
import { listShops } from "@/lib/services/shops";

export default async function InvoicesPage() {
  const [shops, invoices] = await Promise.all([
    listShops(),
    listInvoices()
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Generate invoices from uninvoiced work entries."
      />
      <InvoiceForm shops={shops} />
      <div className="section-card">
        <InvoiceTable data={invoices} />
      </div>
    </div>
  );
}
