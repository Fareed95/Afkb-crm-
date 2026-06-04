"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { paymentSchema, type PaymentInput } from "@/lib/validation";
import { paymentModes, paymentModeLabels } from "@/constants";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Loader2, IndianRupee, Clock } from "lucide-react";

export function PaymentForm({
  shops
}: {
  shops: { id: string; shop_name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const form = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      shop_id: shops[0]?.id ?? "",
      amount: 0,
      payment_mode: paymentModes[0],
      payment_date: new Date().toISOString().slice(0, 10),
      remarks: ""
    }
  });

  const onSubmit = async (values: PaymentInput) => {
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await requestJson("/api/payments", {
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
          <h3 className="font-display font-bold text-lg text-foreground">Record Payment</h3>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Add a new payment or advance credit</p>
        </div>
        {currentTime && (
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-bold font-mono tracking-tight">
              {currentTime.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
      {error ? (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700 font-medium border border-emerald-500/20 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          Payment recorded successfully!
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Shop</Label>
          <Select className="input-lg" {...form.register("shop_id")}>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.shop_name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input className="input-lg" type="number" step="0.01" {...form.register("amount")} />
        </div>
        <div className="space-y-2">
          <Label>Payment mode</Label>
          <Select className="input-lg" {...form.register("payment_mode")}>
            {paymentModes.map((mode) => (
              <option key={mode} value={mode}>
                {paymentModeLabels[mode]}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Payment date</Label>
          <Input className="input-lg" type="date" {...form.register("payment_date")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Remarks</Label>
        <Input className="input-lg" {...form.register("remarks")} />
      </div>
      <Button className="btn-lg w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300" disabled={loading}>
        {loading ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Recording...</>
        ) : (
          <><IndianRupee className="mr-2 h-5 w-5" /> Record Payment</>
        )}
      </Button>
    </form>
    </div>
  );
}
