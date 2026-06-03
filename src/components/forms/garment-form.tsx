"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { garmentSchema, type GarmentInput } from "@/lib/validation";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GarmentForm({
  initialValues,
  garmentId
}: {
  initialValues?: Partial<GarmentInput>;
  garmentId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<GarmentInput>({
    resolver: zodResolver(garmentSchema),
    defaultValues: {
      garment_name: "",
      default_rate: 0,
      ...initialValues
    }
  });

  const onSubmit = async (values: GarmentInput) => {
    setError(null);
    try {
      if (garmentId) {
        await requestJson(`/api/garments/${garmentId}`, {
          method: "PATCH",
          body: JSON.stringify(values)
        });
      } else {
        await requestJson("/api/garments", {
          method: "POST",
          body: JSON.stringify(values)
        });
      }
      router.push("/garments");
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
          <Label>Garment name</Label>
          <Input className="input-lg" {...form.register("garment_name")} />
        </div>
        <div className="space-y-2">
          <Label>Default rate</Label>
          <Input
            className="input-lg"
            type="number"
            step="0.01"
            {...form.register("default_rate")}
          />
        </div>
      </div>
      <Button className="btn-lg">Save Garment</Button>
    </form>
  );
}
