import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { garmentSchema, type GarmentInput } from "@/lib/validation";
import { requireOwner } from "@/lib/auth/require-auth";

export async function listGarments(shopId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("garments")
    .select("*")
    .eq("shop_id", shopId)
    .order("garment_name");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createGarment(input: GarmentInput) {
  await requireOwner();
  const values = garmentSchema.parse(input);
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("garments")
    .insert(values)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateGarment(id: string, input: GarmentInput) {
  await requireOwner();
  const values = garmentSchema.parse(input);
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("garments")
    .update(values)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteGarment(id: string) {
  await requireOwner();
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("garments").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
