import { getSupabaseServerClient } from "@/lib/db/supabase-server";

export type LedgerLine = {
  id: string;
  entry_date: string;
  created_at: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export async function getLedger(shopId: string) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("ledger_entries")
    .select("*")
    .eq("shop_id", shopId)
    .order("entry_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  let running = 0;
  const lines: LedgerLine[] = (data ?? []).map((entry) => {
    running += Number(entry.debit) - Number(entry.credit);
    return {
      id: entry.id,
      entry_date: entry.entry_date,
      created_at: entry.created_at,
      description: entry.description,
      debit: Number(entry.debit),
      credit: Number(entry.credit),
      balance: Math.round(running * 100) / 100
    };
  });

  return lines;
}

export async function getShopBalance(shopId: string, asOf?: string) {
  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from("ledger_entries")
    .select("debit, credit")
    .eq("shop_id", shopId);

  if (asOf) {
    query = query.lte("entry_date", asOf);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const balance = (data ?? []).reduce(
    (sum, entry) => sum + Number(entry.debit) - Number(entry.credit),
    0
  );

  return Math.round(balance * 100) / 100;
}
