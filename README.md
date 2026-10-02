# Web3Ladies

The Web3Ladies website and admin portal — a community and programs platform for
women building careers, products, and opportunities across blockchain, AI, and
emerging technology in Africa and the UAE.

This codebase is a faithful rebuild of the original site (previously hosted on
Lovable), running on our own Supabase project and deployed on Vercel.

## What's inside

**Public site**

| Route | Page |
| --- | --- |
| `/` | Home |
| `/venture-builder` (also `/bootcamp`) | Web3 × AI Venture Builder + application form |
| `/events` | Events, hosting requests, upcoming and past events |
| `/community` | Community + join form |
| `/partner` | Partnerships, sponsorship packages + enquiry form |
| `/news` | News and insights |
| `/cohorts` | Cohort learning tracks |
| `/membership` | Web3Ladies Circle membership + application form |

**Admin portal** — `/w3l-admin` (sign-in required)

Dashboard, Featured, Testimonials, Events, Cohorts, Blog Posts, Partners,
Social Proof, Impact, Submissions (with Excel export), Form Config (edit the
public forms), Founder Story, Media library, and Users (superadmins only).

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) · React 19 · TypeScript
- Tailwind CSS v3 · shadcn/ui components (Radix) · framer-motion · lucide-react
- [Supabase](https://supabase.com) — Postgres, Auth, Row Level Security, Storage
- TanStack Query (admin data loading) · SheetJS (Excel export) · sonner (toasts)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev                  # http://localhost:3000
```

Full first-time setup — creating the Supabase project, running the database
scripts, and creating the first admin — is in **[SETUP.md](SETUP.md)**.

### Environment variables

| Name | Where it's used |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server (public, protected by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — user management API. **Never commit or expose it.** |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint the codebase |

## Project structure

```
src/
  app/
    (public)/          public pages (share the navbar + footer)
    w3l-admin/         admin login, password reset, and the admin screens
    api/admin/users/   server-only user management (superadmin)
  components/
    site/              public page sections and views
    admin/             admin auth, guard, layout, data hooks
    public/            navbar + footer
    ui/                shared UI components
  lib/                 Supabase clients, data queries, types, form defaults
supabase/
  migrations/          database schema, security policies, storage, seed data
  RUN_ALL.sql          all migrations in one script for the SQL Editor
public/                images, press kit, and report PDFs
```

## Deployment

Pushes to `master` deploy to Vercel. The three environment variables above must
be set in the Vercel project, and the Supabase **Auth → URL Configuration** must
list the site's URL so password-reset and invite emails link back correctly.
