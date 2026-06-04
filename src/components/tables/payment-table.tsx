"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Store, CreditCard, Banknote } from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table";

export function PaymentTable({ data }: { data: any[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, shopName: string, amount: number) => {
    if (!confirm(`Delete payment of ${formatCurrency(amount)} from "${shopName}"? This will reverse the ledger entry and restore this amount as outstanding.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await requestJson(`/api/payments/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  if (data.length === 0) {
    return (
      <div className="py-16 text-center border rounded-2xl bg-card shadow-sm border-dashed">
        <p className="text-muted-foreground font-semibold">No payments recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-semibold text-foreground py-4 px-6">Shop</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6">Date & Time</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6">Remarks</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6">Mode</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6 text-right">Amount</TableHead>
            <TableHead className="text-right py-4 px-6 font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((payment) => (
            <TableRow key={payment.id} className={`hover:bg-muted/30 transition-colors ${deletingId === payment.id ? "opacity-50" : ""}`}>
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-foreground">{payment.shops?.shop_name ?? "Unknown Shop"}</span>
                </div>
              </TableCell>
              <TableCell className="py-4 px-6 font-medium text-foreground">
                {formatDateTime(payment.created_at || payment.payment_date)}
              </TableCell>
              <TableCell className="py-4 px-6 text-muted-foreground max-w-[200px] truncate" title={payment.remarks}>
                {payment.remarks || "-"}
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  {payment.payment_mode === "cash" ? <Banknote className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                  {payment.payment_mode}
                </div>
              </TableCell>
              <TableCell className="py-4 px-6 text-right">
                <span className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg font-black tracking-tight text-base">
                  {formatCurrency(Number(payment.amount))}
                </span>
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="flex items-center justify-end whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    disabled={deletingId === payment.id}
                    onClick={() => handleDelete(payment.id, payment.shops?.shop_name || "this shop", Number(payment.amount))}
                  >
                    {deletingId === payment.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
