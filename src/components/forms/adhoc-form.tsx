"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { adhocSchema, type AdhocInput } from "@/lib/validation";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Zap, Loader2, Shirt } from "lucide-react";

// Extend adhocSchema for the frontend UI form
const formSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  phone: z.string().optional().or(z.literal("")),
  receipt_date: z.string().min(1, "Receipt date is required"),
  items: z.array(z.object({
    garment_name: z.string().min(1, "Garment name required"),
    quantity: z.coerce.number().min(1, "Quantity required"),
    rate: z.coerce.number().min(0, "Rate required")
  })).min(1, "Add at least one item"),
  work_description: z.string().optional()
});

type FormInput = z.infer<typeof formSchema>;

export function AdhocForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      phone: "",
      receipt_date: new Date().toISOString().slice(0, 10),
      items: [{ garment_name: "", quantity: 1, rate: 0 }],
      work_description: ""
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  const items = form.watch("items");
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);

  const onSubmit = async (values: FormInput) => {
    setError(null);
    setIsSubmitting(true);
    try {
      // Compile items into work_description
      const itemsList = values.items.map(item => `${item.garment_name} x${item.quantity} (₹${item.rate})`).join(", ");
      const finalDescription = values.work_description ? `${itemsList} | Notes: ${values.work_description}` : itemsList;

      const payload: AdhocInput = {
        customer_name: values.customer_name,
        phone: values.phone,
        work_description: finalDescription,
        amount: totalAmount,
        receipt_date: values.receipt_date
      };

      await requestJson("/api/adhoc", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setSuccess(true);
      form.reset({
        customer_name: "",
        phone: "",
        receipt_date: new Date().toISOString().slice(0, 10),
        items: [{ garment_name: "", quantity: 1, rate: 0 }],
        work_description: ""
      });
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-card relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-primary/10 shadow-lg group">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50 relative z-10">
        <div>
          <h3 className="font-display font-bold text-lg text-foreground">Create Adhoc Bill</h3>
          <p className="text-xs text-muted-foreground mt-1 font-medium">Record a walk-in customer receipt</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
          <Zap className="h-5 w-5" />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10 max-w-2xl">
        {error ? (
          <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            {error}
          </div>
        ) : null}
        
        {success ? (
          <div className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700 font-medium border border-emerald-500/20 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Adhoc bill recorded successfully!
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">Customer Name</Label>
            <Input className="input-lg w-full" placeholder="John Doe" {...form.register("customer_name")} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">Phone Number</Label>
            <Input className="input-lg w-full" placeholder="+91 98765 43210" {...form.register("phone")} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">Receipt Date</Label>
            <Input className="input-lg w-full" type="date" {...form.register("receipt_date")} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">Total Amount</Label>
            <div className="flex h-12 w-full items-center rounded-xl border border-primary/20 bg-primary/5 px-4 font-black text-primary text-lg">
              ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">Garment Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ garment_name: "", quantity: 1, rate: 0 })} className="h-8 rounded-lg">
              <Plus className="mr-1.5 h-3 w-3" /> Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-[1fr_80px_100px_40px] gap-2 items-center">
                <Input
                  className="input-lg h-10 border-border/50 text-sm placeholder:text-muted-foreground"
                  placeholder="Garment (e.g. Shirt)"
                  {...form.register(`items.${index}.garment_name`)}
                />
                <Input
                  className="input-lg h-10 border-border/50 text-sm font-semibold"
                  type="number"
                  step="0.01"
                  placeholder="Qty"
                  {...form.register(`items.${index}.quantity`)}
                />
                <Input
                  className="input-lg h-10 border-border/50 text-sm font-semibold"
                  type="number"
                  step="0.01"
                  placeholder="Rate"
                  {...form.register(`items.${index}.rate`)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-border/50">
          <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">Additional Notes</Label>
          <Textarea className="min-h-[80px] rounded-xl text-sm border-border/50" placeholder="Optional description or remarks..." {...form.register("work_description")} />
        </div>

        <Button className="btn-lg w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300" disabled={isSubmitting || fields.length === 0}>
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Recording...</>
          ) : (
            <><Zap className="mr-2 h-5 w-5" /> Save Adhoc Receipt</>
          )}
        </Button>
      </form>
    </div>
  );
}
