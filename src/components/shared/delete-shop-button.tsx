"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { requestJson } from "@/lib/utils/request";

export function DeleteShopButton({ shopId, shopName }: { shopId: string; shopName: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await requestJson(`/api/shops/${shopId}`, {
        method: "DELETE"
      });
      router.push("/shops");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete shop:", error);
      alert("Failed to delete shop. Ensure all payments are cleared.");
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in-fade">
        <div className="flex items-center gap-4 text-destructive">
          <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Are you absolutely sure?</p>
            <p className="text-sm opacity-90">This will permanently delete {shopName} and all related ledger entries.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="ghost" 
            className="flex-1 sm:flex-none h-12 rounded-xl"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1 sm:flex-none h-12 rounded-xl shadow-lg shadow-destructive/20"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
            Yes, Delete Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={() => setShowConfirm(true)}
      className="h-12 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Shop
    </Button>
  );
}
