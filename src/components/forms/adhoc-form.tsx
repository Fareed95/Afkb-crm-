"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { adhocSchema, type AdhocInput } from "@/lib/validation";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AdhocForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<AdhocInput>({
    resolver: zodResolver(adhocSchema),
    defaultValues: {
      customer_name: "",
      phone: "",
      work_description: "",
      amount: 0,
      receipt_date: new Date().toISOString().slice(0, 10)
    }
  });

  const onSubmit = async (values: AdhocInput) => {
    setError(null);
    try {
      await requestJson("/api/adhoc", {
        method: "POST",
        body: JSON.stringify(values)
      });
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="section-card space-y-4">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Customer name</Label>
          <Input className="input-lg" {...form.register("customer_name")} />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input className="input-lg" {...form.register("phone")} />
        </div>
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input className="input-lg" type="number" step="0.01" {...form.register("amount")} />
        </div>
        <div className="space-y-2">
          <Label>Receipt date</Label>
          <Input className="input-lg" type="date" {...form.register("receipt_date")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Work description</Label>
        <Textarea {...form.register("work_description")} />
      </div>
      <Button className="btn-lg">Create Receipt</Button>
    </form>
  );
}
