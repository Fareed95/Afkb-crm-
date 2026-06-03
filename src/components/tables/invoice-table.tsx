import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table";

export function InvoiceTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Shop</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.invoice_number}</TableCell>
            <TableCell>{invoice.shops?.shop_name ?? ""}</TableCell>
            <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
            <TableCell>{formatCurrency(Number(invoice.grand_total))}</TableCell>
            <TableCell>
              <Link
                href={`/invoices/${invoice.id}`}
                className="text-sm font-semibold text-primary"
              >
                View
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
