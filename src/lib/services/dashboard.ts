import { getSupabaseServerClient } from "@/lib/db/supabase-server";

export type DashboardSnapshot = {
  kpis: {
    todaysRevenue: number;
    monthRevenue: number;
    pendingBalance: number;
    totalShops: number;
    totalInvoices: number;
    totalPayments: number;
    totalGarmentsProcessed: number;
  };
  revenueByDay: { date: string; total: number }[];
  revenueByMonth: { month: string; total: number }[];
  outstandingByShop: { shop: string; balance: number }[];
  topCustomers: { shop: string; total: number }[];
  mostProcessed: { garment: string; quantity: number }[];
};

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const supabase = await getSupabaseServerClient();
  const now = new Date();
  const today = toDateString(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthStartStr = toDateString(monthStart);

  const [{ count: shopCount }, { count: invoiceCount }, { count: paymentCount }] =
    await Promise.all([
      supabase.from("shops").select("id", { count: "exact", head: true }),
      supabase.from("invoices").select("id", { count: "exact", head: true }),
      supabase.from("payments").select("id", { count: "exact", head: true })
    ]);

  const { data: payments } = await supabase
    .from("payments")
    .select("amount, payment_date");

  const { data: ledgerEntries } = await supabase
    .from("ledger_entries")
    .select("shop_id, debit, credit");

  const { data: shops } = await supabase
    .from("shops")
    .select("id, shop_name");

  const { data: invoices } = await supabase
    .from("invoices")
    .select("shop_id, subtotal, invoice_date");

  const { data: items } = await supabase
    .from("work_entry_items")
    .select("garment_name, quantity");

  const todaysRevenue = (payments ?? [])
    .filter((payment) => payment.payment_date === today)
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const monthRevenue = (payments ?? [])
    .filter((payment) => payment.payment_date >= monthStartStr)
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const pendingBalance = (ledgerEntries ?? []).reduce(
    (sum, entry) => sum + Number(entry.debit) - Number(entry.credit),
    0
  );

  const totalGarmentsProcessed = (items ?? []).reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const revenueByDay = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    const dateStr = toDateString(date);
    const total = (payments ?? [])
      .filter((payment) => payment.payment_date === dateStr)
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    return { date: dateStr, total };
  });

  const revenueByMonth = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const monthLabel = date.toLocaleString("en-IN", { month: "short" });
    const monthStr = toDateString(date).slice(0, 7);
    const total = (payments ?? [])
      .filter((payment) => payment.payment_date.startsWith(monthStr))
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    return { month: monthLabel, total };
  });

  const shopMap = new Map((shops ?? []).map((shop) => [shop.id, shop.shop_name]));
  const outstandingByShop = Array.from(
    (ledgerEntries ?? []).reduce((map, entry) => {
      const balance = (map.get(entry.shop_id) ?? 0) +
        Number(entry.debit) -
        Number(entry.credit);
      map.set(entry.shop_id, balance);
      return map;
    }, new Map<string, number>())
  )
    .map(([shopId, balance]) => ({
      shop: shopMap.get(shopId) ?? "Unknown",
      balance
    }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  const topCustomers = Array.from(
    (invoices ?? []).reduce((map, invoice) => {
      const total = (map.get(invoice.shop_id) ?? 0) + Number(invoice.subtotal);
      map.set(invoice.shop_id, total);
      return map;
    }, new Map<string, number>())
  )
    .map(([shopId, total]) => ({
      shop: shopMap.get(shopId) ?? "Unknown",
      total
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const mostProcessed = Array.from(
    (items ?? []).reduce((map, item) => {
      const qty = (map.get(item.garment_name) ?? 0) + Number(item.quantity);
      map.set(item.garment_name, qty);
      return map;
    }, new Map<string, number>())
  )
    .map(([garment, quantity]) => ({ garment, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    kpis: {
      todaysRevenue,
      monthRevenue,
      pendingBalance,
      totalShops: shopCount ?? 0,
      totalInvoices: invoiceCount ?? 0,
      totalPayments: paymentCount ?? 0,
      totalGarmentsProcessed
    },
    revenueByDay,
    revenueByMonth,
    outstandingByShop,
    topCustomers,
    mostProcessed
  };
}
