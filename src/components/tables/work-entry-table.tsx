import { formatCurrency } from "@/lib/utils/format";
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
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-semibold text-foreground py-4 px-6">Date & Time</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6">Shop</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6">Garments</TableHead>
            <TableHead className="font-semibold text-foreground py-4 px-6 text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => {
            const total = (entry.work_entry_items ?? []).reduce(
              (sum: number, item: any) => sum + Number(item.amount),
              0
            );

            // Format date and time local to Indian locale
            const formattedDateTime = new Date(entry.created_at || entry.work_date).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Kolkata"
            });

            return (
              <TableRow key={entry.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-foreground py-4 px-6">{formattedDateTime}</TableCell>
                <TableCell className="font-semibold py-4 px-6">{entry.shops?.shop_name ?? "Unknown Shop"}</TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex flex-wrap gap-1.5 max-w-[450px]">
                    {entry.work_entry_items?.map((item: any, idx: number) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center rounded-lg bg-secondary/80 px-2.5 py-1 text-xs font-bold text-secondary-foreground border border-border"
                      >
                        {item.garment_name} <span className="text-primary font-black ml-1">({Number(item.quantity)})</span>
                      </span>
                    ))}
                    {(!entry.work_entry_items || entry.work_entry_items.length === 0) && (
                      <span className="text-muted-foreground text-xs italic">No garments recorded</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-black text-right py-4 px-6 text-foreground">{formatCurrency(total)}</TableCell>
              </TableRow>
            );
          })}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No recent work entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
