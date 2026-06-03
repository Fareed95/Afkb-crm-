import { getSupabaseServerClient } from "@/lib/db/supabase-server";

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
