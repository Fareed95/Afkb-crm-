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

export function ShopForm({
  initialValues,
  shopId
}: {
  initialValues?: Partial<ShopInput>;
  shopId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
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
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="section-card space-y-4"
    >
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
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
      <Button className="btn-lg">Save Shop</Button>
    </form>
  );
}
