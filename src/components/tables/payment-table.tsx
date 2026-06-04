"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
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
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">No payments recorded yet.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shop</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Remarks</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((payment) => (
          <TableRow key={payment.id} className={deletingId === payment.id ? "opacity-50" : ""}>
            <TableCell className="font-medium">{payment.shops?.shop_name ?? "Unknown Shop"}</TableCell>
            <TableCell>{formatDate(payment.payment_date)}</TableCell>
            <TableCell className="text-muted-foreground max-w-[200px] truncate" title={payment.remarks}>
              {payment.remarks || "-"}
            </TableCell>
            <TableCell className="capitalize">{payment.payment_mode}</TableCell>
            <TableCell className="font-bold text-emerald-600">
              {formatCurrency(Number(payment.amount))}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end whitespace-nowrap">
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1.5 h-8"
                  disabled={deletingId === payment.id}
                  onClick={() => handleDelete(payment.id, payment.shops?.shop_name || "this shop", Number(payment.amount))}
                >
                  {deletingId === payment.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
