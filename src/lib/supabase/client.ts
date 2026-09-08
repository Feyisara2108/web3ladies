import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. Uses the public anon key only — never the
 * service-role key. All privileged access is enforced by RLS + server code.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
