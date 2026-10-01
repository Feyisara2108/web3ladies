-- Web3Ladies — schema
-- Mirrors the original (Lovable) database: same table and column names, so the
-- public site and admin read and write exactly as the live site did.

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('user', 'admin', 'superadmin');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users (id) on delete cascade,
  role       public.app_role not null default 'user',
  created_at timestamptz not null default now()
);

-- True when the current user has the given role (superadmin implies admin).
-- security definer so RLS policies can call it without recursing into user_roles.
create or replace function public.has_role(_role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and (role = _role or (_role = 'admin' and role = 'superadmin'))
  );
$$;

-- The first account ever created becomes superadmin; everyone after starts as
-- 'user' (no admin access) until a superadmin changes their role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (
    new.id,
    case when exists (select 1 from public.user_roles) then 'user'::public.app_role
         else 'superadmin'::public.app_role end
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Accounts that existed before this script ran: if no roles exist yet, the
-- oldest account becomes superadmin and the rest start as 'user'.
insert into public.user_roles (user_id, role)
select id,
       case when row_number() over (order by created_at) = 1
            then 'superadmin'::public.app_role else 'user'::public.app_role end
from auth.users
where not exists (select 1 from public.user_roles)
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------
create table if not exists public.featured_items (
  id            uuid primary key default gen_random_uuid(),
  type          text,
  title         text not null,
  description   text,
  href          text,
  cta           text,
  badge         text,
  icon          text,
  display_order integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.events (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  event_type       text,
  event_date       timestamptz,
  end_date         timestamptz,
  location         text,
  is_virtual       boolean not null default false,
  registration_url text,
  image_url        text,
  category         text,
  is_featured      boolean not null default false,
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  status           text not null default 'upcoming',
  recording_url    text,
  report_url       text,
  gallery_images   text[] not null default '{}',
  platform         text
);

create table if not exists public.cohorts (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  description        text,
  track              text not null default 'Blockchain',
  cohort_number      integer,
  start_date         date,
  end_date           date,
  application_url    text,
  status             text not null default 'upcoming',
  total_participants integer not null default 0,
  completion_rate    numeric,
  is_published       boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  content      text,
  author_name  text,
  category     text not null default 'News',
  is_featured  boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text,
  category      text,
  highlight     text,
  full_quote    text,
  image_url     text,
  is_featured   boolean not null default false,
  display_order integer not null default 0,
  page          text not null default 'home',
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  source_url    text
);

create table if not exists public.social_proof_items (
  id            uuid primary key default gen_random_uuid(),
  image_url     text,
  caption       text not null,
  tag           text,
  display_order integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.partners (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  logo_url      text,
  website_url   text,
  category      text not null default 'supporter', -- supporter | past
  report_url    text,
  report_label  text,
  description   text,
  display_order integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.impact_stats (
  id            uuid primary key default gen_random_uuid(),
  value         text not null,
  label         text not null,
  description   text,
  page          text not null default 'home', -- home | partner
  display_order integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.impact_highlights (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  icon          text,
  report_url    text,
  report_label  text,
  display_order integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.founder_story (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  title        text,
  story        text,
  quote        text,
  image_url    text,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Forms
-- ---------------------------------------------------------------------------
create table if not exists public.form_configs (
  id               uuid primary key default gen_random_uuid(),
  form_type        text not null unique,
  form_title       text,
  form_description text,
  submit_label     text,
  fields           jsonb not null default '[]'::jsonb,
  updated_at       timestamptz not null default now()
);

create table if not exists public.form_submissions (
  id         uuid primary key default gen_random_uuid(),
  form_type  text not null,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists form_submissions_form_type_idx
  on public.form_submissions (form_type, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'featured_items', 'events', 'cohorts', 'blog_posts', 'testimonials',
    'social_proof_items', 'partners', 'impact_stats', 'impact_highlights',
    'founder_story', 'form_configs'
  ] loop
    execute format('drop trigger if exists %I_updated_at on public.%I;', t, t);
    execute format(
      'create trigger %I_updated_at before update on public.%I
         for each row execute function public.set_updated_at();', t, t);
  end loop;
end $$;
