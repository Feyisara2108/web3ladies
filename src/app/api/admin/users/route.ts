import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSuperadmin } from "@/lib/dal";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * User management for the admin (replaces the live site's `manage-users`
 * edge function). Superadmins only. Actions: list, create, update_role, delete.
 */

const ROLES = ["user", "moderator", "admin", "superadmin"] as const;
type Role = (typeof ROLES)[number];

const fail = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const caller = await getSuperadmin();
  if (!caller) return fail("Only superadmins can manage users.", 403);

  const body = await request.json().catch(() => null);
  const admin = createAdminClient();

  switch (body?.action) {
    case "list": {
      const [{ data: usersData, error }, { data: roles }] = await Promise.all([
        admin.auth.admin.listUsers({ perPage: 1000 }),
        admin.from("user_roles").select("user_id, role"),
      ]);
      if (error) return fail(error.message, 500);
      const roleOf = new Map((roles ?? []).map((r) => [r.user_id, r.role]));
      return Response.json(
        usersData.users.map((u) => ({
          id: u.id,
          email: u.email,
          role: roleOf.get(u.id) ?? "user",
          created_at: u.created_at,
        })),
      );
    }

    case "create": {
      const { email, password, role } = body as { email?: string; password?: string; role?: Role };
      if (!email || !password) return fail("Email and password are required.");
      if (role && !ROLES.includes(role)) return fail("Invalid role.");

      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error || !data.user) return fail(error?.message ?? "Could not create user.");

      const { error: roleError } = await admin
        .from("user_roles")
        .upsert({ user_id: data.user.id, role: role ?? "user" }, { onConflict: "user_id" });
      if (roleError) return fail(roleError.message, 500);

      // Send a "set your password" email. Implicit flow so the link works in any browser.
      const mailer = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { flowType: "implicit", persistSession: false, autoRefreshToken: false } },
      );
      const { error: mailError } = await mailer.auth.resetPasswordForEmail(email, {
        redirectTo: `${new URL(request.url).origin}/w3l-admin/reset-password`,
      });
      return Response.json({
        id: data.user.id,
        email_sent: !mailError,
        email_error: mailError?.message ?? null,
      });
    }

    case "update_role": {
      const { user_id, role } = body as { user_id?: string; role?: Role };
      if (!user_id || !role || !ROLES.includes(role)) return fail("Invalid role update.");
      if (user_id === caller.id) return fail("You can't change your own role.");
      const { error } = await admin
        .from("user_roles")
        .upsert({ user_id, role }, { onConflict: "user_id" });
      if (error) return fail(error.message, 500);
      return Response.json({ ok: true });
    }

    case "delete": {
      const { user_id } = body as { user_id?: string };
      if (!user_id) return fail("Missing user_id.");
      if (user_id === caller.id) return fail("You can't delete your own account.");
      const { error } = await admin.auth.admin.deleteUser(user_id);
      if (error) return fail(error.message, 500);
      return Response.json({ ok: true });
    }

    default:
      return fail("Unknown action.");
  }
}
