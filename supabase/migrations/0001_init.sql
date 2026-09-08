-- Web3Ladies — initial schema
-- Entities derived from the live site + admin brief. Content tables share a
-- common shape: `is_published` gates public visibility, `position` orders them.
-- Run order: 0001_init.sql → 0002_rls.sql → 0003_seed_forms.sql

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Roles & profiles
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('superadmin', 'admin');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        public.app_role not null default 'admin',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Role checks as SECURITY DEFINER fns so policies can call them without
-- recursing through profiles' own RLS.
create or replace function public.current_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.profiles
  where id = auth.uid() and role in ('admin','superadmin')
) $$;

create or replace function public.is_superadmin()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (
  select 1 from public.profiles where id = auth.uid() and role = 'superadmin'
) $$;

-- New auth users get a profile automatically. The very first user becomes the
-- superadmin (bootstraps User Management); everyone after is a plain admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  first_user boolean;
begin
  select count(*) = 0 into first_user from public.profiles;
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    case when first_user then 'superadmin'::public.app_role else 'admin'::public.app_role end
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Shared updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------------------------------------------------------------------------
-- Content tables (consumed by the public website)
-- ---------------------------------------------------------------------------

-- Homepage "What's happening" carousel
create table if not exists public.featured_items (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  category     text,               -- e.g. Program, Grant, Event
  cta_label    text,
  cta_url      text,
  image_url    text,
  position     integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Member testimonials, placed on various pages
create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text,               -- e.g. "Web3 Developer"
  quote        text not null,
  category     text,               -- free tag
  placement    text not null default 'home', -- home | community | cohorts | partner | membership
  avatar_url   text,
  position     integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Events (workshops, AMAs, panels, meetups)
create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  event_type    text,              -- Panel | Career Talk | Community Meetup | Workshop | AMA | Masterclass | Demo Day | Other
  description   text,
  event_date    date,
  location      text,
  status        text not null default 'upcoming', -- upcoming | past
  recording_url text,
  register_url  text,
  image_url     text,
  position      integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Cohorts / learning tracks (currently empty in prod)
create table if not exists public.cohorts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  track        text,
  status       text not null default 'upcoming', -- upcoming | open | closed | completed
  start_date   date,
  end_date     date,
  apply_url    text,
  position     integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Blog / news posts (currently empty in prod)
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  excerpt       text,
  body          text,
  cover_image_url text,
  author        text,
  published_at  timestamptz,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Partners / supporters
create table if not exists public.partners (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  logo_url     text,
  website_url  text,
  category     text not null default 'logo_marquee', -- logo_marquee | past_partner
  position     integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Social proof: "win highlights" with a title + category tag
-- (e.g. "Nofisat's team won a prize at the Celo MiniPay Hack" / "Hackathon Win").
create table if not exists public.social_proof (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,      -- the highlight statement
  category     text,               -- Hackathon Win | Worktool Grant | Workshop Impact | ...
  description  text,
  source_url   text,
  image_url    text,
  position     integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Impact statistics: a number + label + a supporting description paragraph
-- (e.g. "20,000+" / "women reached" / "We've shown up in the feeds...").
create table if not exists public.impact_stats (
  id           uuid primary key default gen_random_uuid(),
  value        text not null,      -- "20,000+"
  label        text not null,      -- "women reached"
  description  text,               -- supporting paragraph
  position     integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Founder story (sectioned; founder = Oluchi Enebeli)
create table if not exists public.founder_story (
  id           uuid primary key default gen_random_uuid(),
  section_key  text,
  heading      text,
  body         text,
  image_url    text,
  position     integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Media library (backed by Supabase Storage)
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  bucket      text not null default 'media',
  path        text not null,
  url         text not null,
  filename    text,
  mime_type   text,
  size_bytes  bigint,
  alt         text,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (bucket, path)
);

-- ---------------------------------------------------------------------------
-- Configurable forms (admin Form Config → public forms)
-- ---------------------------------------------------------------------------
create table if not exists public.forms (
  id             uuid primary key default gen_random_uuid(),
  key            text unique not null,  -- community_join, event_host_request, ...
  title          text not null,
  description    text,
  submit_label   text not null default 'Submit',
  success_message text not null default 'Thank you! Your submission has been received.',
  is_active      boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.form_fields (
  id           uuid primary key default gen_random_uuid(),
  form_id      uuid not null references public.forms (id) on delete cascade,
  name         text not null,        -- machine key, unique within a form
  label        text not null,
  field_type   text not null default 'text', -- text | email | textarea | select | checkbox | tel | url | number
  placeholder  text,
  help_text    text,
  is_required  boolean not null default false,
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (form_id, name)
);

create table if not exists public.form_field_options (
  id         uuid primary key default gen_random_uuid(),
  field_id   uuid not null references public.form_fields (id) on delete cascade,
  label      text not null,
  value      text not null,
  position   integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Submissions
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id          uuid primary key default gen_random_uuid(),
  form_id     uuid references public.forms (id) on delete set null,
  form_key    text,                 -- snapshot in case the form is later deleted
  source      text not null default 'form', -- form | import
  meta        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create table if not exists public.submission_values (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions (id) on delete cascade,
  field_id      uuid references public.form_fields (id) on delete set null,
  field_name    text not null,      -- snapshot label/name (supports Excel imports)
  value         text
);

create index if not exists idx_submission_values_submission on public.submission_values (submission_id);
create index if not exists idx_submissions_form on public.submissions (form_id);
create index if not exists idx_form_fields_form on public.form_fields (form_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','featured_items','testimonials','events','cohorts','blog_posts',
    'partners','social_proof','impact_stats','founder_story','forms','form_fields'
  ] loop
    execute format('drop trigger if exists set_updated_at on public.%I;', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at();', t);
  end loop;
end $$;
