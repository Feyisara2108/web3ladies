"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

type Order = { column: string; ascending?: boolean };

/**
 * Loads every row of a table for an admin screen. Refetches each time the
 * screen opens (like the live admin), and `refetch` reloads after an edit.
 */
export function useAdminRows<T>(table: string, order: Order, filter?: { column: string; value: string }) {
  return useQuery({
    queryKey: ["admin", table, order, filter],
    refetchOnMount: "always",
    queryFn: async () => {
      let query = createClient().from(table).select("*");
      if (filter) query = query.eq(filter.column, filter.value);
      const { data } = await query.order(order.column, { ascending: order.ascending ?? true });
      return (data ?? []) as T[];
    },
  });
}
