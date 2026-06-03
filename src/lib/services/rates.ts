import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { requireOwner } from "@/lib/auth/require-auth";

export async function listShopRates(shopId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("shop_garment_rates")
    .select("*, garments(garment_name, default_rate)")
    .eq("shop_id", shopId);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function setShopRate({
  shopId,
  garmentId,
  rate
}: {
  shopId: string;
  garmentId: string;
  rate: number;
}) {
  await requireOwner();
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("shop_garment_rates")
    .upsert({ shop_id: shopId, garment_id: garmentId, rate })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
