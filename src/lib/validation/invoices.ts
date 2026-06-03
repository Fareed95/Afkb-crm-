import { z } from "zod";

export const invoiceCreateSchema = z.object({
  shop_id: z.string().uuid({ message: "Shop is required" }),
  invoice_date: z.string().min(1, "Invoice date is required")
});

export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>;
