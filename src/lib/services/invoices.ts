import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { invoiceCreateSchema, type InvoiceCreateInput } from "@/lib/validation";
import { requireOwner } from "@/lib/auth/require-auth";

export async function listInvoices() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*, shops(shop_name)")
    .order("invoice_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getInvoiceById(id: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*), shops(shop_name, phone_number, email)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { data: previousInvoice } = await supabase
    .from("invoices")
    .select("invoice_number, invoice_date, subtotal, created_at")
    .eq("shop_id", data.shop_id)
    .lt("created_at", data.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: lastPayment } = await supabase
    .from("payments")
    .select("payment_date, amount, created_at")
    .eq("shop_id", data.shop_id)
    .lt("created_at", data.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    ...data,
    previous_invoice: previousInvoice,
    last_payment: lastPayment
  };
}

export async function createInvoice(input: InvoiceCreateInput) {
  const { user } = await requireOwner();
  const values = invoiceCreateSchema.parse(input);
  const supabase = await getSupabaseServerClient();

  const { data: entries, error: entriesError } = await supabase
    .from("work_entries")
    .select("id, work_date, created_at")
    .eq("shop_id", values.shop_id)
    .lte("work_date", values.invoice_date);

  if (entriesError) {
    throw new Error(entriesError.message);
  }

  const entryMap = new Map(entries?.map((entry) => [entry.id, entry.work_date]));
  const entryTimeMap = new Map(entries?.map((entry) => [entry.id, entry.created_at]));
  const entryIds = entries?.map((entry) => entry.id) ?? [];

  if (entryIds.length === 0) {
    throw new Error("No pending work entries found up to this date.");
  }

  const { data: items, error: itemsError } = await supabase
    .from("work_entry_items")
    .select("*")
    .in("work_entry_id", entryIds);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const itemIds = items?.map((item) => item.id) ?? [];
  const { data: invoicedItems } = await supabase
    .from("invoice_items")
    .select("work_entry_item_id")
    .in("work_entry_item_id", itemIds);

  const invoicedIds = new Set(
    (invoicedItems ?? []).map((item) => item.work_entry_item_id)
  );

  const payloadItems = (items ?? [])
    .filter((item) => !invoicedIds.has(item.id))
    .map((item) => ({
      work_entry_item_id: item.id,
      work_date: entryMap.get(item.work_entry_id),
      work_timestamp: entryTimeMap.get(item.work_entry_id),
      garment_name: item.garment_name,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount
    }));

  if (payloadItems.length === 0) {
    throw new Error("All items up to this date are already invoiced.");
  }

  // Dynamically calculate the date range of the items being billed
  const dates = payloadItems.map((item) => item.work_date as string).sort();
  const computedDateFrom = dates[0];
  const computedDateTo = dates[dates.length - 1];

  const timestamps = payloadItems.map((item) => new Date(item.work_timestamp).getTime()).sort();
  const computedTimestampFrom = new Date(timestamps[0]).toISOString();
  const computedTimestampTo = new Date(timestamps[timestamps.length - 1]).toISOString();

  const { data, error } = await supabase.rpc("create_invoice_with_items", {
    p_shop_id: values.shop_id,
    p_date_from: computedDateFrom,
    p_date_to: computedDateTo,
    p_invoice_date: values.invoice_date,
    p_created_by: user.id,
    p_items: payloadItems,
    p_timestamp_from: computedTimestampFrom,
    p_timestamp_to: computedTimestampTo
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteInvoice(invoiceId: string) {
  await requireOwner();
  const supabase = await getSupabaseServerClient();

  // Delete the ledger entry linked to this invoice first
  const { error: ledgerError } = await supabase
    .from("ledger_entries")
    .delete()
    .eq("source_type", "invoice")
    .eq("source_id", invoiceId);

  if (ledgerError) {
    throw new Error(ledgerError.message);
  }

  // Delete the invoice (cascade deletes invoice_items, freeing work_entry_items for re-billing)
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId);

  if (error) {
    throw new Error(error.message);
  }

  return { deleted: true };
}
