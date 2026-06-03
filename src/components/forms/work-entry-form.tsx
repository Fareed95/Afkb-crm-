"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { workEntrySchema, type WorkEntryInput } from "@/lib/validation";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, Plus, Trash2, ArrowLeft, Loader2, CheckCircle2, Shirt } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Garment {
  id: string;
  garment_name: string;
  default_rate: number;
}

interface ShopRate {
  garment_id: string;
  rate: number;
}

export function WorkEntryForm({
  shops
}: {
  shops: { id: string; shop_name: string }[];
}) {
  const router = useRouter();
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [shopGarments, setShopGarments] = useState<Garment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WorkEntryInput>({
    resolver: zodResolver(workEntrySchema),
    defaultValues: {
      shop_id: "",
      work_date: new Date().toISOString().slice(0, 10),
      remarks: "",
      items: []
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items"
  });

  useEffect(() => {
    if (!selectedShop) return;
    
    const fetchGarments = async () => {
      setLoadingRates(true);
      try {
        const data = await requestJson(`/api/garments?shopId=${selectedShop}`, { method: "GET" });
        setShopGarments(data);
        form.setValue("shop_id", selectedShop);
        replace([]);
      } catch (err) {
        console.error("Failed to fetch garments", err);
      } finally {
        setLoadingRates(false);
      }
    };

    fetchGarments();
  }, [selectedShop]);

  const addPresetGarment = (garment: Garment) => {
    // Check if garment is already in the list
    const existingIndex = fields.findIndex(f => f.garment_name === garment.garment_name);
    if (existingIndex !== -1) {
      const currentQty = Number(form.getValues(`items.${existingIndex}.quantity`) || 0);
      form.setValue(`items.${existingIndex}.quantity`, currentQty + 1);
    } else {
      append({ garment_name: garment.garment_name, quantity: 1, rate: Number(garment.default_rate), is_custom: false });
    }
  };

  const addCustomGarment = () => {
    append({ garment_name: "", quantity: 1, rate: 0, is_custom: true });
  };

  const onSubmit = async (values: WorkEntryInput) => {
    if (values.items.length === 0) {
      setError("Please add at least one garment to the work entry.");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    try {
      await requestJson("/api/work-entries", {
        method: "POST",
        body: JSON.stringify(values)
      });
      setSelectedShop(null);
      form.reset();
      replace([]);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedShop) {
    return (
      <div className="section-card p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Store className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-display font-semibold">Select a Shop</h2>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Choose a shop. You can then quickly add garments by tapping them, using their configured rates.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <button
              key={shop.id}
              onClick={() => setSelectedShop(shop.id)}
              className="flex items-center gap-5 p-4 sm:p-6 rounded-2xl border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all duration-200 text-left group"
            >
              <div className="h-12 w-12 shrink-0 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <span className="font-semibold text-base block">{shop.shop_name}</span>
                <span className="text-xs text-primary font-medium mt-1 inline-block">Start Entry &rarr;</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const activeShopName = shops.find(s => s.id === selectedShop)?.shop_name;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="section-card p-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b px-6 py-4 bg-muted/30">
        <div className="flex items-center gap-4">
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={() => setSelectedShop(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-display font-bold">New Entry</h2>
            <p className="text-xs font-medium text-muted-foreground">For {activeShopName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Label className="text-xs font-semibold text-muted-foreground">Work Date</Label>
          <Input className="input-lg w-40 h-10" type="date" {...form.register("work_date")} />
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            {error}
          </div>
        )}

        {loadingRates ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="font-medium">Loading configured rates...</span>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-8">
            
            {/* Left sidebar: Garment Picker */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold uppercase text-muted-foreground tracking-wider block">Quick Add Garment</Label>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {shopGarments.map(g => {
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => addPresetGarment(g)}
                      className="flex items-center justify-between p-3 rounded-xl border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Shirt className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm">{g.garment_name}</span>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">₹{g.default_rate}</span>
                    </button>
                  );
                })}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 border-dashed"
                onClick={addCustomGarment}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Item
              </Button>
            </div>

            {/* Right side: Form Fields */}
            <div className="space-y-6 lg:pl-8 lg:border-l">
              <Label className="text-sm font-semibold uppercase text-muted-foreground tracking-wider block mb-4">Selected Items</Label>
              
              {fields.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground">
                  <Shirt className="h-10 w-10 mb-2 opacity-50" />
                  <p>No items added yet.</p>
                  <p className="text-sm mt-1">Tap a garment on the left to add it.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => {
                    const isPreset = field.is_custom === false;
                    return (
                    <div key={field.id} className={cn("grid grid-cols-[1fr_100px_100px_50px] gap-3 p-3 rounded-xl border bg-card items-center transition-colors", isPreset && "bg-muted/10 border-dashed")}>
                      <Input
                        className={cn("input-lg h-10 border-0 shadow-none font-medium px-2", isPreset && "pointer-events-none text-muted-foreground bg-transparent")}
                        placeholder="Garment Name"
                        readOnly={isPreset}
                        tabIndex={isPreset ? -1 : 0}
                        {...form.register(`items.${index}.garment_name`)}
                      />

                      <div className="relative">
                        <Input
                          className="input-lg h-10 border-0 shadow-none font-semibold px-2 text-primary focus-visible:ring-primary/30 bg-primary/5"
                          type="number"
                          step="0.01"
                          placeholder="Qty"
                          {...form.register(`items.${index}.quantity`)}
                        />
                      </div>

                      <div className="relative">
                        <Input
                          className={cn("input-lg h-10 border-0 shadow-none font-medium px-2", isPreset && "pointer-events-none text-muted-foreground bg-transparent")}
                          type="number"
                          step="0.01"
                          placeholder="Rate"
                          readOnly={isPreset}
                          tabIndex={isPreset ? -1 : 0}
                          {...form.register(`items.${index}.rate`)}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )})}
                </div>
              )}

              <div className="pt-6 border-t">
                <Label className="text-sm font-semibold uppercase text-muted-foreground tracking-wider block mb-2">Remarks</Label>
                <Textarea 
                  className="min-h-[80px] rounded-xl text-sm" 
                  placeholder="Optional notes for this entry..."
                  {...form.register("remarks")} 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t bg-muted/30 px-6 py-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting || loadingRates || fields.length === 0} className="btn-lg w-full sm:w-auto px-8">
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <><CheckCircle2 className="mr-2 h-4 w-4" /> Save Entry</>
          )}
        </Button>
      </div>
    </form>
  );
}
