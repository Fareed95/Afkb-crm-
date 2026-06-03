import { z } from "zod";

export const workEntryItemSchema = z.object({
  garment_id: z.string().uuid().optional().nullable(),
  garment_name: z.string().min(1, "Garment name is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  rate: z.coerce.number().min(0, "Rate is required"),
  is_custom: z.boolean().optional()
});

export const workEntrySchema = z.object({
  shop_id: z.string().uuid({ message: "Shop is required" }),
  work_date: z.string().min(1, "Work date is required"),
  remarks: z.string().optional().or(z.literal("")),
  items: z.array(workEntryItemSchema).min(1, "Add at least one item")
});

export type WorkEntryInput = z.infer<typeof workEntrySchema>;
