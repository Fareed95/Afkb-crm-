import { z } from "zod";

export const shopSchema = z.object({
  shop_name: z.string().min(1, "Shop name is required"),
  phone_number: z.string().min(8, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal(""))
});

export type ShopInput = z.infer<typeof shopSchema>;
