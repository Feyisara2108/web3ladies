-- Web3Ladies — all migrations in order (paste into the Supabase SQL Editor).

-- ===== 0001_schema.sql =====
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

-- ===== 0002_rls.sql =====
-- Web3Ladies — Row Level Security
--   * Public: read published content and form configs; submit forms.
--   * Admins (admin | superadmin): full control of content, forms, submissions.
--   * Users can read their own role (the admin uses this to gate access).
--   * Only superadmins manage roles; account create/delete goes through the
--     server-only /api/admin/users route (service-role key).

-- ---- content: public reads published rows, admins do everything -----------
do $$
declare t text;
begin
  foreach t in array array[
    'featured_items', 'events', 'cohorts', 'blog_posts', 'testimonials',
    'social_proof_items', 'partners', 'impact_stats', 'impact_highlights',
    'founder_story'
  ] loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists %I_public_read on public.%I;', t, t);
    execute format(
      'create policy %I_public_read on public.%I for select
         using (is_published or public.has_role(''admin''));', t, t);

    execute format('drop policy if exists %I_admin_write on public.%I;', t, t);
    execute format(
      'create policy %I_admin_write on public.%I for all
         using (public.has_role(''admin'')) with check (public.has_role(''admin''));', t, t);
  end loop;
end $$;

-- ---- form configs: public read, admin write --------------------------------
alter table public.form_configs enable row level security;

drop policy if exists form_configs_public_read on public.form_configs;
create policy form_configs_public_read on public.form_configs
  for select using (true);

drop policy if exists form_configs_admin_write on public.form_configs;
create policy form_configs_admin_write on public.form_configs
  for all using (public.has_role('admin')) with check (public.has_role('admin'));

-- ---- form submissions: anyone can submit, only admins can read/delete ------
alter table public.form_submissions enable row level security;

drop policy if exists form_submissions_public_insert on public.form_submissions;
create policy form_submissions_public_insert on public.form_submissions
  for insert with check (true);

drop policy if exists form_submissions_admin_read on public.form_submissions;
create policy form_submissions_admin_read on public.form_submissions
  for select using (public.has_role('admin'));

drop policy if exists form_submissions_admin_delete on public.form_submissions;
create policy form_submissions_admin_delete on public.form_submissions
  for delete using (public.has_role('admin'));

-- ---- user roles -------------------------------------------------------------
alter table public.user_roles enable row level security;

drop policy if exists user_roles_read_own on public.user_roles;
create policy user_roles_read_own on public.user_roles
  for select using (user_id = auth.uid() or public.has_role('superadmin'));

drop policy if exists user_roles_superadmin_write on public.user_roles;
create policy user_roles_superadmin_write on public.user_roles
  for all using (public.has_role('superadmin')) with check (public.has_role('superadmin'));

-- ===== 0003_storage.sql =====
-- Web3Ladies — media storage bucket (public images; admins upload/delete).

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists media_admin_insert on storage.objects;
create policy media_admin_insert on storage.objects
  for insert with check (bucket_id = 'media' and public.has_role('admin'));

drop policy if exists media_admin_update on storage.objects;
create policy media_admin_update on storage.objects
  for update using (bucket_id = 'media' and public.has_role('admin'));

drop policy if exists media_admin_delete on storage.objects;
create policy media_admin_delete on storage.objects
  for delete using (bucket_id = 'media' and public.has_role('admin'));

-- ===== 0004_seed.sql =====
-- Web3Ladies — content seed
-- Copied from the live site's database on 2026-10-01 (original ids kept).
-- Safe to re-run: existing rows are left untouched.

-- featured_items (2)
insert into public.featured_items (id, type, title, description, href, cta, badge, icon, display_order, is_published, created_at, updated_at) values
  ('396d126e-c060-4bcc-bc50-6a0d66a1bfde', 'event', 'Web3 x AI Venture Builder — Now Open', 'Our flagship program is accepting applications. Build your MVP, grow your skills, and demo what you create.', '/venture-builder', 'Apply Now', 'Program', 'calendar', 0, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('50e714f4-e5b3-4d68-a12b-99d410f49bbc', 'initiative', 'Worktool Grant Applications Open', 'Apply or sponsor a work tool grant: laptops, internet, and software access for women builders who need it most.', '/partner', 'Learn More', 'Initiative', 'zap', 1, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-30T20:38:54.763061+00:00')
on conflict (id) do nothing;

-- events (3)
insert into public.events (id, title, description, event_type, event_date, end_date, location, is_virtual, registration_url, image_url, category, is_featured, is_published, created_at, updated_at, status, recording_url, report_url, gallery_images, platform) values
  ('081f18ae-b422-4eaa-99a7-5579c8ea1778', 'AI x Web3: The Market Landscape and Opportunity', 'Knowledge sharing session in celebration of IWD 2026, our gift to the community.', 'Panel', '2026-03-07T23:47:00+00:00', null, 'Lagos, Dubai', true, 'https://x.com/web3ladies/status/2030349481451925874?s=20', null, 'Web3 Direction & Ecosystem', true, true, '2026-03-30T19:47:40.874954+00:00', '2026-03-30T20:21:37.905387+00:00', 'past', 'https://x.com/web3ladies/status/2030349481451925874?s=20', 'https://web3ladies.notion.site/AI-X-Web3-32d41d2dadce80dbb581c533dec5f3c2?source=copy_link', '{}'::text[], 'Twitter Space'),
  ('8851c338-bd71-4fdf-a779-67a1117664f8', 'End-of-the-year virtual hangout', null, 'Community Meetup', '2025-12-26T16:00:00+00:00', null, 'Virtual', false, null, null, 'Community & Storytelling', false, true, '2026-03-31T06:02:47.851587+00:00', '2026-03-31T06:02:47.851587+00:00', 'past', null, null, '{}'::text[], 'Private Event'),
  ('dafc6322-d778-4cad-ac7e-0a7f7f511819', 'From Invisible to Influential', null, 'Career Talk', '2026-01-28T17:00:00+00:00', null, null, false, null, null, 'Brand & Visibility', false, true, '2026-03-31T06:04:51.342198+00:00', '2026-03-31T06:04:51.342198+00:00', 'past', 'https://x.com/web3ladies/status/2016554977615855897?s=20', null, '{}'::text[], 'Twitter Space')
on conflict (id) do nothing;

-- partners (18)
insert into public.partners (id, name, logo_url, website_url, category, report_url, report_label, description, display_order, is_published, created_at, updated_at) values
  ('8d3b43de-b213-4b07-b22e-1217d3a6fc07', 'Polygon', null, null, 'supporter', null, null, null, 0, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('19fd1d4a-4f0a-4802-be4f-bc3eccabbb61', 'Celo', null, null, 'supporter', null, null, null, 1, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('359c7811-3a31-4352-83dd-ff2fa149523f', 'Solana', null, null, 'supporter', null, null, null, 2, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('904f41f0-cbe4-4191-8d44-57e72499391f', 'Yellow Card', null, null, 'supporter', null, null, null, 3, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('4bb42f2e-e05b-4b0e-9ad6-88746a8b06ad', 'Nodo', null, null, 'supporter', null, null, null, 4, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('f57091dd-0f67-4075-96af-a27d7e6e0a4e', 'Ethereum Foundation', null, null, 'supporter', null, null, null, 5, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('15f834d2-3f6b-4fc5-a215-b623a87f8bd5', 'Polygon', null, null, 'past', null, null, null, 10, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('70c4d29e-ce0f-4345-9714-c5c2e3c1dd1d', 'Celo Foundation', null, null, 'past', null, null, null, 11, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('c88a2ba3-ad22-49e3-9c9e-75c291ecc48f', 'Yellow Card', null, null, 'past', null, null, null, 12, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('64819769-71eb-4141-9772-8a828f461e3b', 'Filecoin', null, null, 'past', null, null, null, 13, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('2709eaea-9e35-4418-a088-0a431f890143', 'SheCode Africa', null, null, 'past', null, null, null, 14, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('51b19cb2-f0af-46df-81c2-8aeb7bbcf270', 'Nodo', null, null, 'past', null, null, null, 15, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('0a0da475-f28b-43ec-94a5-100b717dcd2a', 'Ethereum Foundation', null, null, 'past', null, null, null, 16, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('cac487e3-dd8c-46ae-a74e-5393d18e117b', 'Solana', null, null, 'past', null, null, null, 17, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('6a87a895-b67f-414e-b4f3-7b81835f332f', 'Starknet', null, null, 'past', null, null, null, 18, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('bb530d5d-bad9-42c6-aac4-4cc69a507e18', 'Base', null, null, 'past', null, null, null, 19, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('fb3da649-98ae-409b-9617-7ecfb1ad6cf1', 'Cartesi', null, null, 'past', null, null, null, 20, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('6de9d836-1913-4a58-bdcc-3d4a528e3b18', 'Stellar / DSF Labs', null, null, 'past', null, null, null, 21, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00')
on conflict (id) do nothing;

-- social_proof_items (4)
insert into public.social_proof_items (id, image_url, caption, tag, display_order, is_published, created_at, updated_at) values
  ('8f75a1fd-f6ae-4d4a-a53c-aab9c1e96848', null, 'Nofisat''s team won a prize at the Celo MiniPay Hack', 'Hackathon Win', 0, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('35ed7b72-2e13-48d3-8282-e0a55e2ca572', null, 'Nofisat received her HP laptop through our Worktool Program', 'Worktool Grant', 1, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('58c1c444-6d54-4a08-9752-29114ac6ac78', null, 'Amarachiugwu''s team won $1,500 at Web3 Lagos Conference', 'Hackathon Win', 2, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('9dde6aa1-64c5-4c06-afef-3a2934e31878', null, 'Amarachiugwu created a SIWE tutorial after a Web3Ladies workshop', 'Workshop Impact', 3, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00')
on conflict (id) do nothing;

-- testimonials (9)
insert into public.testimonials (id, name, role, category, highlight, full_quote, image_url, is_featured, display_order, page, is_published, created_at, updated_at, source_url) values
  ('15eee921-cd12-44c1-9f5e-88e855c9ba63', 'Oluwadamilola', 'Solidity Developer', 'Mentorship', 'I can gladly say I''m a community-taught solidity developer, thanks to Web3Ladies!', 'Over the past couple of months, I have witnessed sporadic growth in my tech journey and this is owing to the amazing mentorship Web3Ladies provided me.', null, false, 0, 'home', true, '2026-03-24T20:05:57.492861+00:00', '2026-03-24T20:05:57.492861+00:00', null),
  ('490c8222-1dd7-4bd2-9414-5a687c753261', 'Nofisat Abiodun Ayanlola', 'Hackathon Winner', 'Hackathon', 'Consistency and having the right energy makes you excel — we won a prize on the Celo hack!', 'Am excited to share our victory of winning a prize pool on our project #ChopConnect on the just concluded Celo hack on MiniPay, thanks to Web3Ladies.', null, false, 1, 'home', true, '2026-03-24T20:05:57.492861+00:00', '2026-03-24T20:05:57.492861+00:00', null),
  ('23ce465d-05c4-4a1c-8152-7016a72a508c', 'Eniola', 'Community Member', 'Worktool', 'Thank you so much @web3ladies — this means a whole lot to me. I got my worktool alreadyyyy!', 'The Work Tool Assistance Program gave me the device I needed to keep building. Without it, I would have been stuck watching from the sidelines.', null, false, 2, 'home', true, '2026-03-24T20:05:57.492861+00:00', '2026-03-24T20:05:57.492861+00:00', null),
  ('5cfbf7bb-d53f-45cc-b767-1bd823b5f0b9', 'Nofisat', 'Worktool Recipient', 'Worktool', 'I am thrilled to say that the reality is here — I just received my gift of an HP laptop from Web3Ladies!', 'Activate tool for more work. All my roadmap to this resilience — am grateful to Web3Ladies and everyone who made this possible.', null, false, 3, 'home', true, '2026-03-24T20:05:57.492861+00:00', '2026-03-24T20:05:57.492861+00:00', null),
  ('8758e924-189c-489b-bdac-454c0e695d7f', 'Amarachiugwu', 'Hackathon Winner', 'Hackathon', 'My team won the $1,500 prize pool at Web3 Lagos Conference under Lisk protocol!', 'Thank you Web3Ladies — you all played significant roles in making this win possible. The skills and community gave me the foundation to compete and deliver.', null, false, 4, 'home', true, '2026-03-24T20:05:57.492861+00:00', '2026-03-24T20:05:57.492861+00:00', null),
  ('5f578db9-9b48-4288-9dd3-595af81dcaac', 'Amarachiugwu', 'Content Creator & Developer', 'Workshop', 'I was inspired to create a YouTube video about Sign In With Ethereum after a Web3Ladies workshop.', 'After joining a workshop by Johanna Fransson hosted by Web3Ladies on SIWE, I discussed the motivation and goal of sign in with Ethereum and the great options it brings.', null, false, 5, 'home', true, '2026-03-24T20:05:57.492861+00:00', '2026-03-24T20:05:57.492861+00:00', null),
  ('cbd966ca-c1a2-4041-bdf6-00813114e5f1', 'Elizabeth', 'Web Developer', 'Mentorship', 'The mentorship helped me develop my organizational and technical skills along with personal development.', 'I had the pleasure to be a mentee at Web3Ladies Cohort II for 4 months without prior knowledge of HTML, CSS, and JavaScript. The mentors have deep knowledge of teaching technical courses.', null, false, 6, 'home', true, '2026-03-24T20:05:57.492861+00:00', '2026-03-24T20:05:57.492861+00:00', null),
  ('e8e50203-30a6-49bb-9fcc-51ee3d557b0c', 'Amarachi', 'Web3 Developer', 'Cohort', 'The cohort made me more eager to learn and provided me with a community to learn with.', 'Prior to the cohort I had tried learning web3 development 2 times but didn''t remain consistent until I got into the cohort that provided me with people to look up to.', null, false, 7, 'home', true, '2026-03-24T20:05:57.492861+00:00', '2026-03-24T20:05:57.492861+00:00', null),
  ('d22046f0-68f1-47f4-b92e-004be8fb77be', 'Amarachukwu', 'Crypto/DeFi Enthusiast', 'Cohort', 'I knew nothing about Crypto. I never traded crypto in my life. Now I am here.', 'I had so many challenges but in the end, I bought my first coin during class. I also started saving in USDT. I am very grateful for the cohort.', null, false, 8, 'home', true, '2026-03-24T20:05:57.492861+00:00', '2026-03-24T20:05:57.492861+00:00', null)
on conflict (id) do nothing;

-- impact_highlights (4)
insert into public.impact_highlights (id, title, description, icon, report_url, report_label, display_order, is_published, created_at, updated_at) values
  ('91a46ab6-f101-41aa-af04-97f79c41c1a0', 'Women Build Celo Hackathon', 'Partnered with Celo Foundation to organize the first-ever female-only hackathon for women in Africa — 300+ participants, 31 teams, 18 live demos.', 'users', '/reports/celo-hackathon-report.pdf', 'Download Celo Hackathon Report', 0, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('36da6aa5-eeab-417a-87c1-c7dbbbbf9733', 'Work Tool Assistance Program', 'Launched initiative to support 1,500 women by 2050 with laptops, inverters, and internet devices. Phase 1 distributed work tools to community members.', 'laptop', '/reports/web3ladies-impact-report.pdf', 'Download Impact Report', 1, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('3609aaee-a4a2-4d30-80a2-1eef1aabad0f', 'Yellow Card Partnership', 'Yellow Card teamed up with Web3Ladies to empower 500+ Nigerian women in tech through structured mentorship and learning programs.', 'award', '/reports/web3ladies-impact-report-2.pdf', 'Download Partnership Report', 2, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('1d61595b-1c8e-4f63-9ac4-43bd3ecb80e0', 'Polygon Mentorship Collaboration', 'Partnered with Polygon in 2022 to enhance mentorship programs, providing structured blockchain engineering tracks for women builders.', 'zap', null, null, 3, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00')
on conflict (id) do nothing;

-- impact_stats (12)
insert into public.impact_stats (id, value, label, description, page, display_order, is_published, created_at, updated_at) values
  ('3bd5ce77-befa-4c4d-ab2a-31d00ef54d45', '20,000+', 'Women across platforms', null, 'home', 0, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('f0f58a73-c4db-433c-87e0-b45a0fba8eed', '50+', 'Events hosted', null, 'home', 1, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('fc09d0d2-d917-48be-b91c-d8f310f53ce9', '1,540+', 'Total applications received', null, 'home', 2, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('58e21827-fb3d-4cdb-882a-9cee38f3cf5f', '483+', 'Mentees accepted and trained', null, 'home', 3, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('750a2105-6262-494e-8b53-be2514e8be9c', '77+', 'Graduates', null, 'home', 4, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('c1720fcd-6099-4a73-b978-8629d7dfdcd2', '49+', 'Projects submitted', null, 'home', 5, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('05b9a5fe-ff6d-4a7b-8440-f3897223357f', '21+', 'Strategic partnerships established', null, 'partner', 0, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('b9348e57-c1bb-4139-b05b-86605d529b6c', '68+', 'Community collaborations & events', null, 'partner', 1, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('5bd1d07d-4f6c-45f5-9801-d9bc7afff488', '36+', 'Hackathons & workshops hosted', null, 'partner', 2, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('8c01624a-2158-40ba-b973-8737206e3bc0', '$18K+', 'Funding raised from partnerships', null, 'partner', 3, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('1df975d0-ca67-4340-8a26-c80846557ba9', '483+', 'Women mentored through programs', null, 'partner', 4, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-24T18:10:31.974256+00:00'),
  ('0e264ec6-270c-4dd1-98c3-ef13ad317c39', '40%', 'Mentees secured opportunities in Web3', null, 'partner', 5, true, '2026-03-24T18:10:31.974256+00:00', '2026-03-30T20:26:51.19976+00:00')
on conflict (id) do nothing;

-- form_configs (5)
insert into public.form_configs (id, form_type, form_title, form_description, submit_label, fields, updated_at) values
  ('8b43174b-78d4-4e33-bd7d-8fc9af8d2264', 'venture_builder', 'Apply to the Web3 x AI Venture Builder', 'This program is for women ready to build with more clarity, confidence, and intention.', 'I am Interested', '[{"name": "name", "type": "text", "label": "Full name", "order": 0, "required": true, "placeholder": "Full name"}, {"name": "email", "type": "email", "label": "Email", "order": 1, "required": true, "placeholder": "Email"}, {"name": "linkedin", "type": "text", "label": "LinkedIn / Portfolio", "order": 2, "required": false, "placeholder": "LinkedIn / Portfolio"}, {"name": "location", "type": "text", "label": "Country / City", "order": 3, "required": true, "placeholder": "Country / City"}, {"name": "role", "type": "text", "label": "Current role", "order": 4, "required": false, "placeholder": "Current role"}, {"name": "why", "type": "textarea", "label": "Why do you want to join this program?", "order": 5, "required": true, "placeholder": "Why do you want to join this program?"}, {"name": "build", "type": "textarea", "label": "What do you want to build or explore?", "order": 6, "required": false, "placeholder": "What do you want to build or explore?"}, {"name": "meaningful", "type": "textarea", "label": "What would make this experience meaningful for you?", "order": 7, "required": false, "placeholder": "What would make this experience meaningful for you?"}]'::jsonb, '2026-03-30T21:12:14.031251+00:00'),
  ('3c4f7a74-b852-4e75-b7a9-90de431d33dc', 'partner', 'Partner with Web3Ladies', 'Tell us about your organization and how you''d like to support.', 'Send Inquiry', '[{"name": "name", "type": "text", "label": "Your name", "order": 0, "required": true, "placeholder": "Your name"}, {"name": "company", "type": "text", "label": "Company / Organization", "order": 1, "required": true, "placeholder": "Company / Organization"}, {"name": "email", "type": "email", "label": "Email", "order": 2, "required": true, "placeholder": "Email"}, {"name": "website", "type": "text", "label": "Website", "order": 3, "required": false, "placeholder": "Website"}, {"name": "type", "type": "select", "label": "Partnership type", "order": 4, "options": ["Scholarship Partner", "Work Tool Partner", "Event Series Sponsor", "Cohort / Track Sponsor", "Annual Ecosystem Partner", "Custom Partnership"], "required": false, "placeholder": "Select partnership type"}, {"name": "explore", "type": "textarea", "label": "What would you like to explore?", "order": 5, "required": true, "placeholder": "What would you like to explore?"}]'::jsonb, '2026-03-30T21:12:14.031251+00:00'),
  ('97c5f6e6-c047-47dd-b67f-1a128106c7ac', 'membership', 'Apply for Founding Membership', 'Tell us about yourself and why you''d like to join the Circle.', 'Submit Application', '[{"name": "name", "type": "text", "label": "Full name", "order": 0, "required": true, "placeholder": "Full name"}, {"name": "email", "type": "email", "label": "Email", "order": 1, "required": true, "placeholder": "Email"}, {"name": "location", "type": "text", "label": "Country / City", "order": 2, "required": true, "placeholder": "Country / City"}, {"name": "role", "type": "text", "label": "Current role or area of focus", "order": 3, "required": false, "placeholder": "Current role or area of focus"}, {"name": "why", "type": "textarea", "label": "Why do you want to join the Web3Ladies Circle?", "order": 4, "required": true, "placeholder": "Why do you want to join the Web3Ladies Circle?"}]'::jsonb, '2026-03-30T21:12:14.031251+00:00'),
  ('6a006022-a1b1-482c-9cc3-53e2e9366227', 'event_host', 'Submit a hosting request', 'Your knowledge has been waiting for a stage. This is it.

The Web3Ladies Host Platform is where emerging voices become recognized names.

Every month, one woman gets the floor—to teach a skill, host a conversation, or lead a session that moves this community forward.

We don''t require a perfect CV or years of experience. We require intentionality, preparation, and a genuine desire to add value to this community. If that''s you, we want to hear from you.

Fill in the form below. We review every application personally and we''ll be in touch. 💜', 'Submit Hosting Request', '[{"name": "name", "type": "text", "label": "Your name", "order": 0, "required": true, "placeholder": "Your name"}, {"name": "email", "type": "email", "label": "Email address", "order": 1, "required": true, "placeholder": "Email address"}, {"name": "organization", "type": "text", "label": "LinkedIn Handle", "order": 2, "required": true, "placeholder": "LinkedIn Url"}, {"name": "eventType", "type": "select", "label": "Event type", "order": 3, "options": ["Workshop", "Panel", "AMA", "Masterclass", "Meetup", "Demo Day", "Other"], "required": true, "placeholder": "Event type"}, {"name": "message", "type": "textarea", "label": "Describe your event idea", "order": 4, "required": true, "placeholder": "Describe your event idea"}, {"name": "profession", "type": "text", "label": "In one sentence, what do you do or what are you building?", "order": 5, "required": true, "placeholder": "In one sentence, what do you do or what are you building?"}, {"name": "topic", "type": "textarea", "label": "What topic would you like to speak or teach on?", "order": 6, "required": true, "placeholder": "In one sentence, what do you do or what are you building?"}, {"name": "authority", "type": "textarea", "label": "What gives you the authority to speak on this topic? This can be lived experience, projects you''ve built.", "order": 7, "required": true, "placeholder": "What gives you the authority to speak on this topic? This can be lived experience, projects you''ve built."}, {"name": "sessionoutline", "type": "textarea", "label": "Submit a short outline of your session. Include: the topic title, what you''ll cover, and 3 key takeaways your audience will leave with.", "order": 8, "required": true, "placeholder": "Submit a short outline of your session. Include: the topic title, what you''ll cover, and 3 key takeaways your audience will leave with."}]'::jsonb, '2026-04-20T21:36:17.232+00:00'),
  ('da3af9d7-64c9-4afb-ad94-4cc6cfae76ae', 'community', 'Join Web3Ladies', '', 'Join the Community', '[{"name": "name", "type": "text", "label": "Full name", "order": 0, "required": true, "placeholder": "Full name"}, {"name": "email", "type": "email", "label": "Email", "order": 1, "required": true, "placeholder": "Email"}, {"name": "country", "type": "textarea", "label": "Country of Residence", "order": 2, "required": true, "placeholder": "Country of Residence"}, {"name": "role", "type": "text", "label": "Current role or area of interest", "order": 3, "required": true, "placeholder": "Current role or area of interest"}, {"name": "why", "type": "textarea", "label": "Why do you want to join Web3Ladies?", "order": 4, "required": true, "placeholder": "Why would you like to join Web3ladies?"}, {"name": "level_of_knowledge", "type": "select", "label": "What is your level of knowledge in Blockchain/AI?", "order": 5, "options": ["Beginner", "Intermediate", "Expert"], "required": true, "placeholder": "What is your level of knowledge in Blockchain/AI?"}, {"name": "how_did_you_hear", "type": "select", "label": "How did you hear about Web3ladies?", "order": 6, "options": ["Through a Friend ", "Word of Mouth ", "Twitter ", "LinkedIn ", "Instagram ", "Google Search ", "Web3ladies Website ", "Facebook ", "Other"], "required": true, "placeholder": "How did you hear about Web3ladies?"}, {"name": "acknowledgement", "type": "select", "label": "Acknowledgement", "order": 7, "options": ["Yes ", "No"], "required": true, "placeholder": " You also acknowledge your willingness to be a member of our community and plan to adhere to laid down rules and code of conduct. "}]'::jsonb, '2026-05-05T11:18:55.003+00:00')
on conflict (form_type) do nothing;
