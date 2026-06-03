import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { shopSchema, type ShopInput } from "@/lib/validation";
import { requireOwner } from "@/lib/auth/require-auth";

export async function listShops() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .order("shop_name");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getShopById(id: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createShop(input: ShopInput) {
  const { user } = await requireOwner();
  const values = shopSchema.parse(input);
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("shops")
    .insert({
      ...values,
      email: values.email || null,
      address: values.address || null,
      notes: values.notes || null,
      created_by: user.id
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("shop_events").insert({
    shop_id: data.id,
    event_type: "created",
    summary: "Shop created",
    created_by: user.id
  });

  return data;
}

export async function updateShop(id: string, input: ShopInput) {
  const { user } = await requireOwner();
  const values = shopSchema.parse(input);
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("shops")
    .update({
      ...values,
      email: values.email || null,
      address: values.address || null,
      notes: values.notes || null
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("shop_events").insert({
    shop_id: data.id,
    event_type: "updated",
    summary: "Shop updated",
    created_by: user.id
  });

  return data;
}

export async function deleteShop(id: string) {
  const { user } = await requireOwner();
  const supabase = await getSupabaseServerClient();

  // We can't log an event if the shop is about to be deleted 
  // because of foreign key constraint on shop_events.shop_id
  const { error } = await supabase.from("shops").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
