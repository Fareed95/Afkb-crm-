import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getShopById } from "@/lib/services/shops";
import { getLedger } from "@/lib/services/ledger";
import { LedgerTable } from "@/components/tables/ledger-table";
import { ShopRatesForm } from "@/components/forms/shop-rates-form";
import { listGarments } from "@/lib/services/garments";
import { Phone, Mail, MapPin, AlignLeft } from "lucide-react";

export default async function ShopDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Fetch everything in parallel
  const [shop, ledger, garments] = await Promise.all([
    getShopById(id),
    getLedger(id),
    listGarments(id)
  ]);

  return (
    <div className="space-y-8 animate-in-fade">
      <PageHeader
        title={shop.shop_name}
        description="Shop overview, custom rates, and ledger history."
        actions={
          <Link href={`/shops/${id}/edit`}>
            <Button className="btn-lg">
              Edit Settings
            </Button>
          </Link>
        }
      />
      
      <div className="section-card">
        <h3 className="font-display text-xl font-semibold mb-6">Contact Information</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <p className="text-base font-semibold">{shop.phone_number}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email Address</p>
              <p className="text-base font-semibold">{shop.email || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-base font-semibold">{shop.address || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <AlignLeft className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-base font-semibold">{shop.notes || "No notes available"}</p>
            </div>
          </div>
        </div>
      </div>

      <ShopRatesForm 
        shopId={id} 
        garments={garments} 
      />

      <div className="section-card">
        <h3 className="font-display text-xl font-semibold mb-6">Financial Ledger</h3>
        <LedgerTable data={ledger} />
      </div>
    </div>
  );
}
