"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shopSchema, type ShopInput } from "@/lib/validation";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Store } from "lucide-react";

export function ShopForm({
  initialValues,
  shopId
}: {
  initialValues?: Partial<ShopInput>;
  shopId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<ShopInput>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      shop_name: "",
      phone_number: "",
      email: "",
      address: "",
      notes: "",
      ...initialValues
    }
  });

  const onSubmit = async (values: ShopInput) => {
    setError(null);
    setLoading(true);
    try {
      if (shopId) {
        await requestJson(`/api/shops/${shopId}`, {
          method: "PATCH",
          body: JSON.stringify(values)
        });
      } else {
        await requestJson("/api/shops", {
          method: "POST",
          body: JSON.stringify(values)
        });
      }
      router.push("/shops");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="section-card space-y-4"
    >
      {error ? (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          {error}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Shop name</Label>
          <Input className="input-lg" {...form.register("shop_name")} />
        </div>
        <div className="space-y-2">
          <Label>Phone number</Label>
          <Input className="input-lg" {...form.register("phone_number")} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input className="input-lg" type="email" {...form.register("email")} />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input className="input-lg" {...form.register("address")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea {...form.register("notes")} />
      </div>
      <Button className="btn-lg" disabled={loading}>
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
        ) : (
          <><Store className="mr-2 h-4 w-4" /> Save Shop</>
        )}
      </Button>
    </form>
  );
}
