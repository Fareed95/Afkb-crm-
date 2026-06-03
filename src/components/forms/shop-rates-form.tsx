"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, IndianRupee, Trash2 } from "lucide-react";

export function ShopRatesForm({
  shopId,
  garments
}: {
  shopId: string;
  garments: { id: string; garment_name: string; default_rate: number }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [rates, setRates] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    garments.forEach(g => {
      init[g.id] = g.default_rate;
    });
    return init;
  });

  const handleRateChange = (garmentId: string, value: string) => {
    const num = parseFloat(value);
    setRates(prev => ({
      ...prev,
      [garmentId]: isNaN(num) ? 0 : num
    }));
  };

  const handleSave = async (garmentId: string) => {
    setLoading(true);
    setError(null);
    setSuccessMsg("");
    try {
      await requestJson(`/api/garments/${garmentId}`, {
        method: "PATCH",
        body: JSON.stringify({
          garment_name: garments.find(g => g.id === garmentId)?.garment_name,
          default_rate: rates[garmentId],
          shop_id: shopId
        })
      });
      setSuccessMsg("Rate updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGarment = async (garmentId: string) => {
    if (!confirm("Are you sure you want to delete this garment?")) return;
    setLoading(true);
    try {
      await requestJson(`/api/garments/${garmentId}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewGarment = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const garmentName = formData.get("garment_name") as string;
    const defaultRate = formData.get("default_rate") as string;
    
    if (!garmentName || !defaultRate) return;
    
    setLoading(true);
    try {
      await requestJson("/api/garments", {
        method: "POST",
        body: JSON.stringify({
          garment_name: garmentName,
          default_rate: parseFloat(defaultRate),
          shop_id: shopId
        })
      });
      setSuccessMsg(`Created new garment: ${garmentName}`);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <IndianRupee className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-display font-semibold">Shop Garments</h3>
            <p className="text-sm text-muted-foreground">Manage garments specific to this shop.</p>
          </div>
        </div>
        
        <form onSubmit={handleCreateNewGarment} className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-border">
          <Input name="garment_name" placeholder="New Garment Name" className="h-9 text-sm w-36" required />
          <Input name="default_rate" type="number" step="0.01" placeholder="Rate" className="h-9 text-sm w-20" required />
          <Button type="submit" size="sm" variant="secondary" className="h-9" disabled={loading}>
            Add
          </Button>
        </form>
      </div>

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      {successMsg && <p className="text-sm text-emerald-500 font-medium">{successMsg}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {garments.map((garment) => {
          return (
            <div key={garment.id} className="relative flex flex-col gap-3 p-5 rounded-2xl border bg-background/50 hover:bg-background/80 transition-colors group">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteGarment(garment.id)}
                className="absolute top-2 right-2 h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="flex justify-between items-center pr-8">
                <Label className="text-base font-semibold">{garment.garment_name}</Label>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input 
                    type="number"
                    step="0.01"
                    className="input-lg pl-8 h-10 rounded-xl"
                    value={rates[garment.id] ?? garment.default_rate}
                    onChange={(e) => handleRateChange(garment.id, e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => handleSave(garment.id)}
                  disabled={loading}
                  className="h-10 rounded-xl shadow-md"
                  variant={rates[garment.id] !== garment.default_rate ? "default" : "secondary"}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
              </div>
            </div>
          );
        })}
        {garments.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            No garments configured for this shop yet. Use the form above to add one.
          </div>
        )}
      </div>
    </div>
  );
}
