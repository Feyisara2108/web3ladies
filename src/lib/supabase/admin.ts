import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. SERVER-ONLY — the `server-only` import makes
 * the build fail if this is ever imported into client code. Bypasses RLS, so
 * only use it inside authorized Server Actions / Route Handlers AFTER verifying
 * the caller with the DAL. Never expose the service-role key to the browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
