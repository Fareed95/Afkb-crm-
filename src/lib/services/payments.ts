import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { paymentSchema, type PaymentInput } from "@/lib/validation";
import { requireOwner } from "@/lib/auth/require-auth";

export async function listPayments() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*, shops(shop_name)")
    .order("payment_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function recordPayment(input: PaymentInput) {
  const { user } = await requireOwner();
  const values = paymentSchema.parse(input);
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.rpc("record_payment", {
    p_shop_id: values.shop_id,
    p_amount: values.amount,
    p_payment_mode: values.payment_mode,
    p_remarks: values.remarks || null,
    p_payment_date: values.payment_date,
    p_created_by: user.id
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
