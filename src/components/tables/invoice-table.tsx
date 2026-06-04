"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Loader2, Store, FileText } from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table";

export function InvoiceTable({ data }: { data: any[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, invoiceNumber: string) => {
    if (!confirm(`Delete invoice ${invoiceNumber}? This will reverse the ledger entry and free all work items for re-billing.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await requestJson(`/api/invoices/${id}`, { method: "DELETE" });
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
        <p className="text-muted-foreground font-semibold">No invoices generated yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-semibold text-foreground py-4 px-6">Invoice No.</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6">Shop</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6">Generated At</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6 text-right">Total Amount</TableHead>
            <TableHead className="text-right py-4 px-6 font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((invoice) => (
            <TableRow key={invoice.id} className={`hover:bg-muted/30 transition-colors ${deletingId === invoice.id ? "opacity-50" : ""}`}>
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-bold tracking-wider text-foreground">{invoice.invoice_number}</span>
                </div>
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{invoice.shops?.shop_name ?? "Unknown"}</span>
                </div>
              </TableCell>
              <TableCell className="py-4 px-6 font-medium text-foreground">
                {formatDateTime(invoice.created_at || invoice.invoice_date)}
              </TableCell>
              <TableCell className="py-4 px-6 text-right">
                <span className="inline-flex px-3 py-1 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-lg font-black tracking-tight text-base">
                  {formatCurrency(Number(invoice.grand_total))}
                </span>
              </TableCell>
              <TableCell className="py-4 px-6">
                <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                  <Link href={`/invoices/${invoice.id}`}>
                    <Button variant="secondary" size="sm" className="gap-1.5 font-bold h-8">
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    disabled={deletingId === invoice.id}
                    onClick={() => handleDelete(invoice.id, invoice.invoice_number)}
                  >
                    {deletingId === invoice.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
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
