# Web3Ladies — Local Setup

Reconstruction of the Web3Ladies public website + admin CMS.
Stack: **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Supabase (Auth/Postgres/RLS/Storage) · react-hook-form + zod · TanStack Query · SheetJS**.

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Supabase project

1. Go to <https://supabase.com>, create a free project.
2. In **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, keep secret)
3. Paste them into `.env.local` (see `.env.example`).

## 3. Run the database migrations

In the Supabase Dashboard **SQL Editor**, run these files in order:

1. `supabase/migrations/0001_init.sql` — tables, roles, triggers
2. `supabase/migrations/0002_rls.sql` — Row Level Security policies
3. `supabase/migrations/0003_storage.sql` — media storage bucket + policies

(Or use the Supabase CLI: `supabase db push`.)

## 4. Create the first admin

In **Authentication → Users**, add a user with an email + password.
The **first** user to sign up is automatically promoted to `superadmin`
(bootstraps User Management); later users default to `admin`.

## 5. Run the app

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Admin portal: <http://localhost:3000/w3l-admin>

## Security notes

- The `service_role` key is used **only** in server code (Server Actions /
  Route Handlers) guarded by `server-only`. Never import it into client code.
- Authorization is enforced in three layers: the auth **proxy** (`src/proxy.ts`,
  optimistic), the **DAL** (`src/lib/dal.ts`, per-request), and database **RLS**.
