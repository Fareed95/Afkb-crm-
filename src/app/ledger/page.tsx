import { PageHeader } from "@/components/shared/page-header";
import { LedgerTable } from "@/components/tables/ledger-table";
import { listShops } from "@/lib/services/shops";
import { getLedger } from "@/lib/services/ledger";

export default async function LedgerPage({
  searchParams
}: {
  searchParams: Promise<{ shopId?: string }>;
}) {
  const { shopId } = await searchParams;
  const shops = await listShops();
  const selectedShop = shopId ?? shops[0]?.id;
  const ledger = selectedShop ? await getLedger(selectedShop) : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ledger"
        description="View running balances and transaction history."
      />
      <form className="section-card space-y-3">
        <label className="text-sm font-semibold">Select shop</label>
        <select
          name="shopId"
          defaultValue={selectedShop}
          className="input-lg w-full"
        >
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.shop_name}
            </option>
          ))}
        </select>
        <button className="btn-lg rounded-xl border bg-primary px-4 text-white">
          View Ledger
        </button>
      </form>
      <div className="section-card">
        <LedgerTable data={ledger} />
      </div>
    </div>
  );
}
