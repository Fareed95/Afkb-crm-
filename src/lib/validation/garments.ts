import { z } from "zod";

export const garmentSchema = z.object({
  shop_id: z.string().uuid("Invalid shop ID"),
  garment_name: z.string().min(1, "Garment name is required"),
  default_rate: z.coerce.number().min(0, "Rate must be positive")
});

export type GarmentInput = z.infer<typeof garmentSchema>;
