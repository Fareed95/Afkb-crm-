import { PageHeader } from "@/components/shared/page-header";
import { PaymentForm } from "@/components/forms/payment-form";
import { PaymentTable } from "@/components/tables/payment-table";
import { listPayments } from "@/lib/services/payments";
import { listShops } from "@/lib/services/shops";

export default async function PaymentsPage() {
  const [shops, payments] = await Promise.all([
    listShops(),
    listPayments()
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Record payments and advances from shops."
      />
      <PaymentForm shops={shops} />
      <div className="section-card">
        <PaymentTable data={payments} />
      </div>
    </div>
  );
}
