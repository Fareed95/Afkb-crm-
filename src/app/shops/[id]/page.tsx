import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getShopById } from "@/lib/services/shops";
import { getLedger, getShopBalance } from "@/lib/services/ledger";
import { LedgerTable } from "@/components/tables/ledger-table";
import { ShopRatesForm } from "@/components/forms/shop-rates-form";
import { listGarments } from "@/lib/services/garments";
import { Phone, Mail, MapPin, AlignLeft, Edit, BadgeCent } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

export default async function ShopDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Fetch everything in parallel
  const [shop, ledger, garments, currentBalance] = await Promise.all([
    getShopById(id),
    getLedger(id),
    listGarments(id),
    getShopBalance(id)
  ]);

  const isDue = currentBalance > 0;
  const isCredit = currentBalance < 0;

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight">{shop.shop_name}</h1>
            {isDue ? (
              <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-500 border border-rose-500/20">
                Payment Due
              </span>
            ) : isCredit ? (
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                In Credit
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-bold text-slate-500 border border-slate-500/20">
                Settled
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1">Shop overview, custom rates, and ledger history.</p>
        </div>
        <Link href={`/shops/${id}/edit`}>
          <Button className="btn-lg flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Settings
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column (Rates & Ledger) */}
        <div className="lg:col-span-2 space-y-8">
          <ShopRatesForm 
            shopId={id} 
            garments={garments} 
          />

          <div className="section-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-semibold">Financial Ledger</h3>
                <p className="text-sm text-muted-foreground mt-1">Timeline of all invoices and payments.</p>
              </div>
            </div>
            <LedgerTable data={ledger} />
          </div>
        </div>

        {/* Right Column (Sidebar metrics & contact details) */}
        <div className="space-y-8">
          {/* Balance Card */}
          <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${
            isDue 
              ? "bg-rose-500/[0.02] border-rose-500/20 text-rose-900 dark:text-rose-100" 
              : isCredit 
                ? "bg-emerald-500/[0.02] border-emerald-500/20 text-emerald-900 dark:text-emerald-100"
                : "bg-slate-500/[0.02] border-border text-slate-900 dark:text-slate-100"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Outstanding Balance</span>
              <BadgeCent className={`h-5 w-5 ${isDue ? "text-rose-500" : isCredit ? "text-emerald-500" : "text-slate-400"}`} />
            </div>
            <div>
              <h2 className={`text-3xl font-black tracking-tight ${isDue ? "text-rose-600 dark:text-rose-400" : isCredit ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                {formatCurrency(currentBalance)}
              </h2>
              <p className="text-xs text-muted-foreground mt-2">
                {isDue 
                  ? "Outstanding balance to be collected from the shop." 
                  : isCredit 
                    ? "Advance credit paid by the shop." 
                    : "All dues are completely settled."}
              </p>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="section-card">
            <h3 className="font-display text-lg font-semibold mb-6">Shop Info</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</p>
                  <p className="font-semibold text-foreground mt-0.5">{shop.phone_number}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t pt-4">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="font-semibold text-foreground mt-0.5 break-all">{shop.email || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t pt-4">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</p>
                  <p className="font-semibold text-foreground mt-0.5">{shop.address || "Not provided"}</p>
                </div>
              </div>

              {shop.notes && (
                <div className="flex items-start gap-3 border-t pt-4">
                  <AlignLeft className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</p>
                    <p className="font-semibold text-foreground mt-0.5 text-sm">{shop.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
