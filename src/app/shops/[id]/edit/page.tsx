import { PageHeader } from "@/components/shared/page-header";
import { ShopForm } from "@/components/forms/shop-form";
import { DeleteShopButton } from "@/components/shared/delete-shop-button";
import { getShopById } from "@/lib/services/shops";

export default async function EditShopPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = await getShopById(id);

  return (
    <div className="space-y-6 animate-in-fade">
      <PageHeader
        title="Edit Shop"
        description="Update shop contact information."
      />
      <div className="section-card">
        <ShopForm
          shopId={id}
          initialValues={{
            shop_name: shop.shop_name,
            phone_number: shop.phone_number,
            email: shop.email ?? "",
            address: shop.address ?? "",
            notes: shop.notes ?? ""
          }}
        />
      </div>
      
      <div className="pt-8 mt-8 border-t border-border/50">
        <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
        <DeleteShopButton shopId={id} shopName={shop.shop_name} />
      </div>
    </div>
  );
}
