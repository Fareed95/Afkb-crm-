import { z } from "zod";

export const shopRateSchema = z.object({
  shop_id: z.string().uuid(),
  garment_id: z.string().uuid(),
  rate: z.coerce.number().min(0, "Rate is required")
});

export type ShopRateInput = z.infer<typeof shopRateSchema>;
