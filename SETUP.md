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

## 3. Set up the database

In the Supabase Dashboard **SQL Editor**, paste and run `supabase/RUN_ALL.sql`.
It runs these in order (each is also in `supabase/migrations/`):

1. `0001_schema.sql` — tables (same names/columns as the original site), roles, triggers
2. `0002_rls.sql` — Row Level Security policies
3. `0003_storage.sql` — public `media` storage bucket + policies
4. `0004_seed.sql` — the original site's content (events, partners, testimonials, …)

It is safe to run again; nothing is duplicated.

## 4. Create the first admin

In **Authentication → Users → Add user**, create a user with an email + password
(tick "Auto Confirm User"). The **first** account becomes `superadmin`; later
accounts start as `user` (no admin access) until a superadmin changes their role
in the admin's User Management screen.

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
