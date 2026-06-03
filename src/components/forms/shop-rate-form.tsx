"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shopRateSchema, type ShopRateInput } from "@/lib/validation";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/format";

export function ShopRateForm({
  shopId,
  garments,
  rates
}: {
  shopId: string;
  garments: { id: string; garment_name: string; default_rate: number }[];
  rates: { garment_id: string; rate: number }[];
}) {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ShopRateInput>({
    resolver: zodResolver(shopRateSchema),
    defaultValues: {
      shop_id: shopId,
      garment_id: garments[0]?.id ?? "",
      rate: 0
    }
  });

  const onSubmit = async (values: ShopRateInput) => {
    setError(null);
    try {
      await requestJson("/api/rates", {
        method: "POST",
        body: JSON.stringify(values)
      });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const rateMap = new Map(rates.map((rate) => [rate.garment_id, rate.rate]));

  return (
    <div className="section-card space-y-4">
      <div className="space-y-2">
        <h3 className="font-display text-lg font-semibold">Shop Rates</h3>
        <p className="text-sm text-muted-foreground">
          Override default garment rates for this shop.
        </p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Garment</Label>
          <Select className="input-lg" {...form.register("garment_id")}>
            {garments.map((garment) => (
              <option key={garment.id} value={garment.id}>
                {garment.garment_name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Rate</Label>
          <Input className="input-lg" type="number" step="0.01" {...form.register("rate")} />
        </div>
        <div className="flex items-end">
          <Button className="btn-lg w-full">Save Rate</Button>
        </div>
      </form>
      <div className="grid gap-2 text-sm">
        {garments.map((garment) => (
          <div key={garment.id} className="flex justify-between rounded-lg border px-4 py-2">
            <span>{garment.garment_name}</span>
            <span className="font-semibold">
              {formatCurrency(rateMap.get(garment.id) ?? garment.default_rate)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
