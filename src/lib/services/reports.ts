import { getSupabaseServerClient } from "@/lib/db/supabase-server";

export type DailyClosingReport = {
  workValue: number;
  invoicesGenerated: number;
  paymentsReceived: number;
  outstandingAdded: number;
  topShop: string;
  topGarment: string;
};

export async function getDailyClosingReport(date: string) {
  const supabase = await getSupabaseServerClient();
  const { data: entries } = await supabase
    .from("work_entries")
    .select("id")
    .eq("work_date", date);

  const entryIds = entries?.map((entry) => entry.id) ?? [];
  const { data: items } = await supabase
    .from("work_entry_items")
    .select("garment_name, quantity, amount")
    .in("work_entry_id", entryIds);

  const workValue = (items ?? []).reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, shop_id, subtotal")
    .eq("invoice_date", date);

  const invoicesGenerated = invoices?.length ?? 0;

  const { data: payments } = await supabase
    .from("payments")
    .select("amount")
    .eq("payment_date", date);

  const paymentsReceived = (payments ?? []).reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  const outstandingAdded = (invoices ?? []).reduce(
    (sum, invoice) => sum + Number(invoice.subtotal),
    0
  );

  const shopTotals = (invoices ?? []).reduce((map, invoice) => {
    const total = (map.get(invoice.shop_id) ?? 0) + Number(invoice.subtotal);
    map.set(invoice.shop_id, total);
    return map;
  }, new Map<string, number>());

  const topShopId = Array.from(shopTotals.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  const { data: shops } = await supabase
    .from("shops")
    .select("id, shop_name")
    .in("id", topShopId ? [topShopId] : []);

  const topShop = shops?.[0]?.shop_name ?? "";

  const garmentTotals = (items ?? []).reduce((map, item) => {
    const total = (map.get(item.garment_name) ?? 0) + Number(item.quantity);
    map.set(item.garment_name, total);
    return map;
  }, new Map<string, number>());

  const topGarment = Array.from(garmentTotals.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] ?? "";

  return {
    workValue,
    invoicesGenerated,
    paymentsReceived,
    outstandingAdded,
    topShop,
    topGarment
  } as DailyClosingReport;
}
