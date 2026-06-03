import { PageHeader } from "@/components/shared/page-header";
import { ShopForm } from "@/components/forms/shop-form";

export default function CreateShopPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Shop"
        description="Add a new tailoring shop with contact details."
      />
      <ShopForm />
    </div>
  );
}
