import { formatCurrency, formatDate } from "@/lib/utils/format";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table";

export function WorkEntryTable({ data }: { data: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Shop</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry) => {
          const total = (entry.work_entry_items ?? []).reduce(
            (sum: number, item: any) => sum + Number(item.amount),
            0
          );
          return (
            <TableRow key={entry.id}>
              <TableCell>{formatDate(entry.work_date)}</TableCell>
              <TableCell>{entry.shops?.shop_name ?? ""}</TableCell>
              <TableCell>{entry.work_entry_items?.length ?? 0}</TableCell>
              <TableCell>{formatCurrency(total)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
