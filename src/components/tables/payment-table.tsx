import { formatCurrency, formatDate } from "@/lib/utils/format";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table";

export function PaymentTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shop</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{payment.shops?.shop_name ?? ""}</TableCell>
            <TableCell>{formatDate(payment.payment_date)}</TableCell>
            <TableCell>{payment.payment_mode}</TableCell>
            <TableCell>{formatCurrency(Number(payment.amount))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
