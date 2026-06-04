import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { workEntrySchema, type WorkEntryInput } from "@/lib/validation";
import { requireAuth } from "@/lib/auth/require-auth";

function roundAmount(value: number) {
  return Math.round(value * 100) / 100;
}

export async function listWorkEntries(shopId?: string) {
  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from("work_entries")
    .select("*, shops(shop_name), work_entry_items(*)")
    .order("work_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (shopId) {
    query = query.eq("shop_id", shopId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createWorkEntry(input: WorkEntryInput) {
  const { user } = await requireAuth();
  const values = workEntrySchema.parse(input);
  const supabase = await getSupabaseServerClient();

  const { data: garments } = await supabase
    .from("garments")
    .select("id, garment_name, default_rate");

  const { data: shopRates } = await supabase
    .from("shop_garment_rates")
    .select("garment_id, rate")
    .eq("shop_id", values.shop_id);

  const garmentMap = new Map(
    (garments ?? []).map((garment) => [
      garment.garment_name.toLowerCase(),
      garment
    ])
  );

  const rateMap = new Map(
    (shopRates ?? []).map((rate) => [rate.garment_id, Number(rate.rate)])
  );

  const { data: entry, error: entryError } = await supabase
    .from("work_entries")
    .insert({
      shop_id: values.shop_id,
      work_date: values.work_date,
      remarks: values.remarks || null,
      created_by: user.id
    })
    .select("*")
    .single();

  if (entryError) {
    throw new Error(entryError.message);
  }

  const items = values.items.map((item) => {
    const normalized = item.garment_name.toLowerCase();
    const garment = garmentMap.get(normalized);
    const fallbackRate = garment ? rateMap.get(garment.id) ?? garment.default_rate : 0;
    const resolvedRate = item.rate > 0 ? item.rate : Number(fallbackRate);

    return {
    work_entry_id: entry.id,
    garment_id: item.garment_id || garment?.id || null,
    garment_name: item.garment_name,
    quantity: item.quantity,
    rate: resolvedRate,
    amount: roundAmount(item.quantity * resolvedRate)
    };
  });

  const { error: itemsError } = await supabase
    .from("work_entry_items")
    .insert(items);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return entry;
}
