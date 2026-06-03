import { formatCurrency, formatDate } from "@/lib/utils/format";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table";

export function AdhocTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((receipt) => (
          <TableRow key={receipt.id}>
            <TableCell>{receipt.customer_name}</TableCell>
            <TableCell>{formatDate(receipt.receipt_date)}</TableCell>
            <TableCell>{formatCurrency(Number(receipt.amount))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
