import { formatCurrency, formatDate } from "@/lib/utils/format";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table";

export function LedgerTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Debit</TableHead>
          <TableHead>Credit</TableHead>
          <TableHead>Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((line) => (
          <TableRow key={line.id}>
            <TableCell>{formatDate(line.entry_date)}</TableCell>
            <TableCell>{line.description}</TableCell>
            <TableCell>{formatCurrency(Number(line.debit))}</TableCell>
            <TableCell>{formatCurrency(Number(line.credit))}</TableCell>
            <TableCell>{formatCurrency(Number(line.balance))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
