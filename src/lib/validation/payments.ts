import { z } from "zod";
import { paymentModes } from "@/constants";

export const paymentSchema = z.object({
  shop_id: z.string().uuid({ message: "Shop is required" }),
  amount: z.coerce.number().min(1, "Amount is required"),
  payment_mode: z.enum(paymentModes),
  payment_date: z.string().min(1, "Payment date is required"),
  remarks: z.string().optional().or(z.literal(""))
});

export type PaymentInput = z.infer<typeof paymentSchema>;
