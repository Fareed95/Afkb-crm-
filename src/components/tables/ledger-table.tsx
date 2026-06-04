import { formatCurrency } from "@/lib/utils/format";
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
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-semibold text-foreground py-4 px-6">Date & Time</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6">Description</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6 text-right">Debit</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6 text-right">Credit</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6 text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((line) => {
            const formattedDateTime = new Date(line.created_at || line.entry_date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            });

            return (
              <TableRow key={line.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-foreground py-4 px-6">{formattedDateTime}</TableCell>
                <TableCell className="py-4 px-6 font-semibold">{line.description}</TableCell>
                <TableCell className={`py-4 px-6 text-right font-bold ${Number(line.debit) > 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
                  {Number(line.debit) > 0 ? `+${formatCurrency(Number(line.debit))}` : "-"}
                </TableCell>
                <TableCell className={`py-4 px-6 text-right font-bold ${Number(line.credit) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                  {Number(line.credit) > 0 ? `-${formatCurrency(Number(line.credit))}` : "-"}
                </TableCell>
                <TableCell className={`py-4 px-6 text-right font-black ${line.balance > 0 ? "text-rose-600 dark:text-rose-400" : line.balance < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900"}`}>
                  {formatCurrency(line.balance)}
                </TableCell>
              </TableRow>
            );
          })}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No ledger entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
