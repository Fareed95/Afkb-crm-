import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { isOwner } from "@/lib/auth/roles";
import type { Profile } from "@/types";

export async function requireAuth() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Unauthenticated");
  }

  const profile = await supabase
    .from("profiles")
    .select("user_id, role, full_name")
    .eq("user_id", data.user.id)
    .single();

  if (profile.error) {
    throw new Error("Profile not found");
  }

  return { user: data.user, profile: profile.data as Profile };
}

export async function requireOwner() {
  const { profile, user } = await requireAuth();

  if (!isOwner(profile.role)) {
    throw new Error("Forbidden");
  }

  return { user, profile };
}
