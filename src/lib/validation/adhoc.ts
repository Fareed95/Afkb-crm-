import { z } from "zod";

export const adhocSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  phone: z.string().optional().or(z.literal("")),
  work_description: z.string().min(1, "Work description is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  receipt_date: z.string().min(1, "Receipt date is required")
});

export type AdhocInput = z.infer<typeof adhocSchema>;
