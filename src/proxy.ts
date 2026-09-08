import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly middleware). Two jobs:
 *   1. Refresh the Supabase auth session cookie on every matched request.
 *   2. Optimistic guard: bounce unauthenticated users away from /w3l-admin
 *      (except the login page) to the login screen.
 *
 * This is an OPTIMISTIC check only. Real authorization is enforced again in the
 * DAL (see src/lib/dal.ts) and inside every Server Action / Route Handler, plus
 * database RLS. Never rely on the proxy alone.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

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
  const isLoginRoute = path === "/w3l-admin" || path === "/w3l-admin/login";

  if (isAdminRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/w3l-admin";
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
