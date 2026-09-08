import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "superadmin" | "admin";

export type SessionUser = {
  id: string;
  email: string | null;
  role: AppRole;
  fullName: string | null;
};

/**
 * Data Access Layer — the single source of truth for "who is calling and what
 * are they allowed to do". Call this at the top of every admin Server
 * Component, Server Action and Route Handler. RLS is the last line of defense;
 * this is the application-level gate.
 *
 * Memoized per-request with React.cache so repeated calls in one render pass
 * hit Supabase once.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Role + profile live in the `profiles` table, keyed by auth user id.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    role: (profile?.role as AppRole) ?? "admin",
    fullName: profile?.full_name ?? null,
  };
});

/** Require any authenticated admin; redirect to login otherwise. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/w3l-admin");
  return user;
}

/** Require a superadmin (e.g. User Management). Redirect admins to dashboard. */
export async function requireSuperadmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "superadmin") redirect("/w3l-admin/dashboard");
  return user;
}
