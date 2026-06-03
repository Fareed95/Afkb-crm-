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

export function InvoiceForm({
  shops
}: {
  shops: { id: string; shop_name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<InvoiceCreateInput>({
    resolver: zodResolver(invoiceCreateSchema),
    defaultValues: {
      shop_id: shops[0]?.id ?? "",
      invoice_date: new Date().toISOString().slice(0, 10)
    }
  });

  const onSubmit = async (values: InvoiceCreateInput) => {
    setError(null);
    try {
      await requestJson("/api/invoices", {
        method: "POST",
        body: JSON.stringify(values)
      });
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="section-card space-y-6 max-w-xl">
      {error ? (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          {error}
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
          <p className="text-xs text-muted-foreground mt-1">This will automatically bill all pending work entries up to this date.</p>
        </div>
      </div>
      
      <Button className="btn-lg w-full">Generate Invoice</Button>
    </form>
  );
}
