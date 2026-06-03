import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { ShopTable } from "@/components/tables/shop-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { listShops } from "@/lib/services/shops";

export default async function ShopsPage() {
  const shops = await listShops();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shops"
        description="Manage tailoring shops and contact details."
        actions={
          <Link href="/shops/create">
            <Button className="btn-lg">Add Shop</Button>
          </Link>
        }
      />
      {shops.length === 0 ? (
        <EmptyState
          title="No shops yet"
          description="Create your first shop to start recording work."
        />
      ) : (
        <div className="section-card">
          <ShopTable data={shops} />
        </div>
      )}
    </div>
  );
}
