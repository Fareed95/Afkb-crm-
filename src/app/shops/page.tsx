import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { listShops } from "@/lib/services/shops";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { Phone, Mail, MapPin, Edit } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

export default async function ShopsPage() {
  const shops = await listShops();

  // Fetch ledger entries to compute balances in parallel
  const supabase = await getSupabaseServerClient();
  const { data: ledgerEntries } = await supabase
    .from("ledger_entries")
    .select("shop_id, debit, credit");

  const balanceMap: Record<string, number> = {};
  (ledgerEntries ?? []).forEach((entry) => {
    const bal = balanceMap[entry.shop_id] ?? 0;
    balanceMap[entry.shop_id] = bal + Number(entry.debit) - Number(entry.credit);
  });

  return (
    <div className="space-y-8 animate-in-fade">
      <PageHeader
        title="Shops"
        description="Manage tailoring shops, custom garment rates, and ledger histories."
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => {
            const balance = balanceMap[shop.id] ?? 0;
            const isDue = balance > 0;
            const isCredit = balance < 0;

            return (
              <div key={shop.id} className="section-card flex flex-col justify-between hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {shop.shop_name}
                      </h3>
                      {shop.address && (
                        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/75" /> 
                          <span className="truncate max-w-[200px]">{shop.address}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 my-6 border-y border-border/50 py-4 text-sm">
                    <div className="flex items-center gap-2.5 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span className="font-semibold text-foreground">{shop.phone_number}</span>
                    </div>
                    {shop.email && (
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <Mail className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                        <span className="font-semibold text-foreground break-all">{shop.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  {/* Balance Indicator */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    isDue 
                      ? "bg-rose-500/[0.02] border-rose-500/10 text-rose-700 dark:text-rose-400" 
                      : isCredit 
                        ? "bg-emerald-500/[0.02] border-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-slate-500/[0.02] border-border text-slate-700 dark:text-slate-400"
                  }`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Balance</span>
                    <span className="text-base font-black">
                      {formatCurrency(balance)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/shops/${shop.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full h-10 rounded-xl font-bold text-xs uppercase tracking-wider">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/shops/${shop.id}/edit`}>
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
