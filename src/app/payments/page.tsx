import { PageHeader } from "@/components/shared/page-header";
import { PaymentForm } from "@/components/forms/payment-form";
import { PaymentTable } from "@/components/tables/payment-table";
import { listPayments } from "@/lib/services/payments";
import { listShops } from "@/lib/services/shops";
import { ClientTabs } from "@/components/ui/client-tabs";
import { PlusCircle, List } from "lucide-react";

export default async function PaymentsPage() {
  const [shops, payments] = await Promise.all([
    listShops(),
    listPayments()
  ]);

  return (
    <div className="space-y-8 animate-in-fade">
      <PageHeader
        title="Payments"
        description="Record incoming payments and advance credits from your shops."
      />
      <ClientTabs 
        tabs={[
          {
            id: "list",
            label: "Payment History",
            icon: <List className="h-4 w-4" />,
            content: <PaymentTable data={payments} />
          },
          {
            id: "create",
            label: "Record Payment",
            icon: <PlusCircle className="h-4 w-4" />,
            content: (
              <div className="max-w-2xl">
                <PaymentForm shops={shops} />
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
