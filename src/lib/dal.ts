import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "user" | "admin" | "superadmin";

export type SessionUser = {
  id: string;
  email: string | null;
  role: AppRole;
};

/**
 * Data Access Layer for server code (Route Handlers): who is calling and what
 * role they have, read from `user_roles`. RLS remains the final gate.
 * Memoized per request with React.cache.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return { id: user.id, email: user.email ?? null, role: (data?.role as AppRole) ?? "user" };
});

/** The calling user if they are a superadmin, otherwise null. */
export async function getSuperadmin(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return user?.role === "superadmin" ? user : null;
}
