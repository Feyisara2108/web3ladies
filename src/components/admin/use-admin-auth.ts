"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/** Session + admin-role state for the admin portal (port of the live site's hook). */
export function useAdminAuth() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkRole = useCallback(
    async (userId: string) => {
      try {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .maybeSingle();
        setIsAdmin(data?.role === "admin" || data?.role === "superadmin");
      } catch {
        setIsAdmin(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setUser(next?.user ?? null);
      if (next?.user) {
        // Defer the query so it doesn't run inside the auth callback.
        setTimeout(() => {
          if (active) checkRole(next.user.id).then(() => active && setLoading(false));
        }, 0);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      if (!active) return;
      setSession(current);
      setUser(current?.user ?? null);
      if (current?.user) checkRole(current.user.id).then(() => active && setLoading(false));
      else setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, checkRole]);

  return {
    user,
    session,
    loading,
    isAdmin,
    signIn: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };
}
