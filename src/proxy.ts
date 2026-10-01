import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly middleware). Two jobs:
 *   1. Refresh the Supabase auth session cookie on every matched request.
 *   2. Optimistic guard: send signed-out visitors on admin screens to the
 *      admin login (the login and reset-password pages stay open).
 *
 * This is an OPTIMISTIC check only. The admin pages re-check the user's role,
 * the users API checks it on the server (src/lib/dal.ts), and database RLS is
 * the final gate. Never rely on the proxy alone.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Until Supabase is configured (env present), skip session handling so the
  // app is fully viewable during setup. Real authorization still lives in the
  // DAL + database RLS once configured.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getClaims/getUser must be called to refresh the session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/w3l-admin");
  const isOpenRoute =
    path === "/w3l-admin/login" || path === "/w3l-admin/reset-password";

  if (isAdminRoute && !isOpenRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/w3l-admin/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image files, so the
     * session cookie stays fresh across the app.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
