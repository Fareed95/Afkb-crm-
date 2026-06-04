"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { invoiceCreateSchema, type InvoiceCreateInput } from "@/lib/validation";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Loader2, FileText } from "lucide-react";

export function InvoiceForm({
  shops
}: {
  shops: { id: string; shop_name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useForm<InvoiceCreateInput>({
    resolver: zodResolver(invoiceCreateSchema),
    defaultValues: {
      shop_id: shops[0]?.id ?? "",
      invoice_date: new Date().toISOString().slice(0, 10)
    }
  });

  const onSubmit = async (values: InvoiceCreateInput) => {
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await requestJson("/api/invoices", {
        method: "POST",
        body: JSON.stringify(values)
      });
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-primary/10 shadow-lg group">
      {/* Decorative background element */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50 relative z-10">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">Generate Invoice</h3>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Create a new bill for pending work</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10 max-w-xl">
      {error ? (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          {error}
        </div>
      ) : null}
      
      {success ? (
        <div className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700 font-medium border border-emerald-500/20 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          Invoice generated successfully!
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold uppercase text-muted-foreground tracking-wider block">Select Shop</Label>
          <Select className="input-lg w-full" {...form.register("shop_id")}>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.shop_name}
              </option>
            ))}
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-semibold uppercase text-muted-foreground tracking-wider block">Invoice Date</Label>
          <Input className="input-lg w-full" type="date" {...form.register("invoice_date")} />
          <p className="text-xs text-muted-foreground mt-1">Automatically bills all pending work entries up to this date.</p>
        </div>
      </div>
      
      <Button className="btn-lg w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-5 w-5" />
            Generate Invoice
          </>
        )}
      </Button>
    </form>
    </div>
  );
}
