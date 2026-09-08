import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Supabase client for Server Components, Server Actions and Route
 * Handlers. In Next.js 16 `cookies()` is async, so this factory is async too.
 *
 * Note: when called from a Server Component, cookie writes are ignored (React
 * disallows setting cookies during render); the auth proxy refreshes the
 * session cookie instead. The try/catch keeps that case from throwing.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore; the proxy
            // handles session refresh.
          }
        },
      },
    },
  );
}
