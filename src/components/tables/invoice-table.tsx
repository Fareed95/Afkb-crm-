"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { requestJson } from "@/lib/utils/request";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, Loader2 } from "lucide-react";
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
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">No invoices generated yet.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Shop</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id} className={deletingId === invoice.id ? "opacity-50" : ""}>
            <TableCell className="font-semibold">{invoice.invoice_number}</TableCell>
            <TableCell>{invoice.shops?.shop_name ?? ""}</TableCell>
            <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
            <TableCell className="font-bold">{formatCurrency(Number(invoice.grand_total))}</TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                <Link href={`/invoices/${invoice.id}`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1.5"
                  disabled={deletingId === invoice.id}
                  onClick={() => handleDelete(invoice.id, invoice.invoice_number)}
                >
                  {deletingId === invoice.id ? (
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
