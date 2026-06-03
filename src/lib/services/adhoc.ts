import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { adhocSchema, type AdhocInput } from "@/lib/validation";
import { requireAuth } from "@/lib/auth/require-auth";

export async function listAdhocReceipts() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("adhoc_receipts")
    .select("*")
    .order("receipt_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createAdhocReceipt(input: AdhocInput) {
  const { user } = await requireAuth();
  const values = adhocSchema.parse(input);
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("adhoc_receipts")
    .insert({
      customer_name: values.customer_name,
      phone: values.phone || null,
      work_description: values.work_description,
      amount: values.amount,
      receipt_date: values.receipt_date,
      created_by: user.id
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
