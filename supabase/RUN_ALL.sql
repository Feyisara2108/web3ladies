-- Web3Ladies — run ALL setup in order (paste into Supabase SQL Editor).
-- Generated from migrations 0001–0005.

-- ======================================================================
-- 0001_init.sql
-- ======================================================================
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


-- ======================================================================
-- 0002_rls.sql
-- ======================================================================
-- Web3Ladies — Row Level Security
-- Model:
--   * Public (anon) can READ published content + active form config.
--   * Public can INSERT submissions (public forms) but never read them.
--   * Admins (admin|superadmin) manage all content, forms, submissions, media.
--   * Only superadmins manage profiles/roles (User Management).
-- RLS is the last line of defense; app code (DAL) enforces the same rules.

-- Enable RLS everywhere
alter table public.profiles            enable row level security;
alter table public.featured_items      enable row level security;
alter table public.testimonials        enable row level security;
alter table public.events              enable row level security;
alter table public.cohorts             enable row level security;
alter table public.blog_posts          enable row level security;
alter table public.partners            enable row level security;
alter table public.social_proof        enable row level security;
alter table public.impact_stats        enable row level security;
alter table public.founder_story       enable row level security;
alter table public.media               enable row level security;
alter table public.forms               enable row level security;
alter table public.form_fields         enable row level security;
alter table public.form_field_options  enable row level security;
alter table public.submissions         enable row level security;
alter table public.submission_values   enable row level security;

-- ---- profiles --------------------------------------------------------------
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_superadmin_write on public.profiles;
create policy profiles_superadmin_write on public.profiles for all
  using (public.is_superadmin()) with check (public.is_superadmin());

-- ---- content tables: public read (published) + admin full control ----------
do $$
declare t text;
begin
  foreach t in array array[
    'featured_items','testimonials','events','cohorts','blog_posts',
    'partners','social_proof','impact_stats','founder_story'
  ] loop
    execute format('drop policy if exists %I_public_read on public.%I;', t, t);
    execute format(
      'create policy %I_public_read on public.%I for select
         using (is_published = true or public.is_admin());', t, t);

    execute format('drop policy if exists %I_admin_write on public.%I;', t, t);
    execute format(
      'create policy %I_admin_write on public.%I for all
         using (public.is_admin()) with check (public.is_admin());', t, t);
  end loop;
end $$;

-- ---- media: public read, admin write ---------------------------------------
drop policy if exists media_public_read on public.media;
create policy media_public_read on public.media for select using (true);
drop policy if exists media_admin_write on public.media;
create policy media_admin_write on public.media for all
  using (public.is_admin()) with check (public.is_admin());

-- ---- forms + fields + options: public read (active) + admin write ----------
drop policy if exists forms_public_read on public.forms;
create policy forms_public_read on public.forms for select
  using (is_active = true or public.is_admin());
drop policy if exists forms_admin_write on public.forms;
create policy forms_admin_write on public.forms for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists form_fields_public_read on public.form_fields;
create policy form_fields_public_read on public.form_fields for select using (true);
drop policy if exists form_fields_admin_write on public.form_fields;
create policy form_fields_admin_write on public.form_fields for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists form_field_options_public_read on public.form_field_options;
create policy form_field_options_public_read on public.form_field_options for select using (true);
drop policy if exists form_field_options_admin_write on public.form_field_options;
create policy form_field_options_admin_write on public.form_field_options for all
  using (public.is_admin()) with check (public.is_admin());

-- ---- submissions: public INSERT only; admin read/manage --------------------
drop policy if exists submissions_public_insert on public.submissions;
create policy submissions_public_insert on public.submissions for insert
  with check (true);
drop policy if exists submissions_admin_read on public.submissions;
create policy submissions_admin_read on public.submissions for select
  using (public.is_admin());
drop policy if exists submissions_admin_manage on public.submissions;
create policy submissions_admin_manage on public.submissions for delete
  using (public.is_admin());

drop policy if exists submission_values_public_insert on public.submission_values;
create policy submission_values_public_insert on public.submission_values for insert
  with check (true);
drop policy if exists submission_values_admin_read on public.submission_values;
create policy submission_values_admin_read on public.submission_values for select
  using (public.is_admin());
drop policy if exists submission_values_admin_manage on public.submission_values;
create policy submission_values_admin_manage on public.submission_values for delete
  using (public.is_admin());


-- ======================================================================
-- 0003_storage.sql
-- ======================================================================
-- Web3Ladies — Storage bucket for the Media Library
-- Public read (logos/images appear on the public site); writes are admin-only.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can read objects in the public media bucket
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select
  using (bucket_id = 'media');

-- Only admins can upload / update / delete media
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());


-- ======================================================================
-- 0004_seed_forms.sql
-- ======================================================================
-- Web3Ladies — seed the 5 configurable public forms (fields + select options).
-- Field labels/types/required flags reproduce the current live forms. Some
-- select option lists were not fully observable and are marked UNKNOWN inline;
-- adjust them in the admin Form Config once verified.
-- Idempotent: safe to re-run (re-seeds fields/options for these 5 forms).

insert into public.forms (key, title, description, submit_label, position) values
  ('community_join',        'Join the Web3Ladies Community', 'Tell us a little about you and why you want to join.', 'Join Community', 0),
  ('event_host_request',    'Host an Event with Web3Ladies', 'Pitch a workshop, AMA, panel, or masterclass for our community.', 'Submit Request', 1),
  ('membership_application', 'Apply for Web3Ladies Circle',  'A curated membership for women ready to do the work.', 'Submit Application', 2),
  ('partner_inquiry',       'Partner with Web3Ladies',       'Let''s build something meaningful together.', 'Send Inquiry', 3),
  ('venture_builder',       'Apply to the Web3 x AI Venture Builder', 'For women ready to build with more clarity, confidence, and intention.', 'Submit Application', 4)
on conflict (key) do update
  set title = excluded.title,
      description = excluded.description,
      submit_label = excluded.submit_label,
      position = excluded.position;

-- Clear existing fields (cascades to options) for a clean re-seed.
delete from public.form_fields
where form_id in (select id from public.forms where key in
  ('community_join','event_host_request','membership_application','partner_inquiry','venture_builder'));

-- Fields ---------------------------------------------------------------------
insert into public.form_fields (form_id, name, label, field_type, is_required, position)
select f.id, v.name, v.label, v.field_type, v.is_required, v.position
from public.forms f
join (values
  -- community_join
  ('community_join','full_name','Full name','text',true,0),
  ('community_join','email','Email','email',true,1),
  ('community_join','country_residence','Country of Residence','textarea',true,2),
  ('community_join','role_interest','Current role or area of interest','text',true,3),
  ('community_join','why_join','Why do you want to join Web3Ladies?','textarea',true,4),
  ('community_join','knowledge_level','What is your level of knowledge in Blockchain/AI?','select',true,5),
  ('community_join','how_heard','How did you hear about Web3Ladies?','select',true,6),
  ('community_join','acknowledgement','Acknowledgement','select',true,7),

  -- event_host_request
  ('event_host_request','your_name','Your name','text',true,0),
  ('event_host_request','email','Email address','email',true,1),
  ('event_host_request','linkedin','LinkedIn Handle','text',true,2),
  ('event_host_request','event_type','Event type','select',true,3),
  ('event_host_request','event_idea','Describe your event idea','textarea',true,4),
  ('event_host_request','what_you_do','In one sentence, what do you do or what are you building?','text',true,5),
  ('event_host_request','topic','What topic would you like to speak or teach on?','textarea',true,6),
  ('event_host_request','authority','What gives you the authority to speak on this topic? This can be lived experience, projects you''ve built.','textarea',true,7),
  ('event_host_request','outline','Submit a short outline of your session. Include: the topic title, what you''ll cover, and 3 key takeaways your audience will leave with.','textarea',true,8),

  -- membership_application
  ('membership_application','full_name','Full name','text',true,0),
  ('membership_application','email','Email','email',true,1),
  ('membership_application','country_city','Country / City','text',true,2),
  ('membership_application','role_focus','Current role or area of focus','text',true,3),
  ('membership_application','why_join_circle','Why do you want to join the Web3Ladies Circle?','textarea',true,4),

  -- partner_inquiry
  ('partner_inquiry','your_name','Your name','text',true,0),
  ('partner_inquiry','company','Company / Organization','text',true,1),
  ('partner_inquiry','email','Email','email',true,2),
  ('partner_inquiry','website','Website','text',true,3),
  ('partner_inquiry','partnership_type','Partnership type','select',false,4),
  ('partner_inquiry','explore','What would you like to explore?','textarea',true,5),

  -- venture_builder
  ('venture_builder','full_name','Full name','text',true,0),
  ('venture_builder','email','Email','email',true,1),
  ('venture_builder','linkedin_portfolio','LinkedIn / Portfolio','text',false,2),
  ('venture_builder','country_city','Country / City','text',true,3),
  ('venture_builder','current_role','Current role','text',false,4),
  ('venture_builder','why_join','Why do you want to join this program?','textarea',true,5),
  ('venture_builder','what_build','What do you want to build or explore?','textarea',false,6),
  ('venture_builder','meaningful','What would make this experience meaningful for you?','textarea',false,7)
) as v(form_key, name, label, field_type, is_required, position)
  on f.key = v.form_key;

-- Select options -------------------------------------------------------------
insert into public.form_field_options (field_id, label, value, position)
select ff.id, o.label, o.value, o.position
from public.form_fields ff
join public.forms f on f.id = ff.form_id
join (values
  -- community_join.knowledge_level
  ('community_join','knowledge_level','Beginner','beginner',0),
  ('community_join','knowledge_level','Intermediate','intermediate',1),
  ('community_join','knowledge_level','Expert','expert',2),
  -- community_join.how_heard
  ('community_join','how_heard','Friend','friend',0),
  ('community_join','how_heard','Word of Mouth','word_of_mouth',1),
  ('community_join','how_heard','Twitter','twitter',2),
  ('community_join','how_heard','LinkedIn','linkedin',3),
  ('community_join','how_heard','Instagram','instagram',4),
  ('community_join','how_heard','Google Search','google',5),
  ('community_join','how_heard','Website','website',6),
  ('community_join','how_heard','Facebook','facebook',7),
  ('community_join','how_heard','Other','other',8),
  -- community_join.acknowledgement (UNKNOWN exact wording)
  ('community_join','acknowledgement','I acknowledge and agree to the community code of conduct','yes',0),
  -- event_host_request.event_type
  ('event_host_request','event_type','Workshop','workshop',0),
  ('event_host_request','event_type','Panel','panel',1),
  ('event_host_request','event_type','AMA','ama',2),
  ('event_host_request','event_type','Masterclass','masterclass',3),
  ('event_host_request','event_type','Meetup','meetup',4),
  ('event_host_request','event_type','Demo Day','demo_day',5),
  ('event_host_request','event_type','Other','other',6),
  -- partner_inquiry.partnership_type (from the partner page tiers)
  ('partner_inquiry','partnership_type','Scholarship Partner','scholarship',0),
  ('partner_inquiry','partnership_type','Work Tool Partner','work_tool',1),
  ('partner_inquiry','partnership_type','Event Series Sponsor','event_series',2),
  ('partner_inquiry','partnership_type','Cohort/Track Sponsor','cohort_track',3),
  ('partner_inquiry','partnership_type','Annual Ecosystem Partner','annual_ecosystem',4),
  ('partner_inquiry','partnership_type','Custom Partnership','custom',5)
) as o(form_key, field_name, label, value, position)
  on f.key = o.form_key and ff.name = o.field_name;


-- ======================================================================
-- 0005_seed_content.sql
-- ======================================================================
-- Web3Ladies — seed observable content (Phase 6)
-- Content + asset paths reproduce the live site (see docs/live-content-reference.md).
-- Images reference files committed to /public/assets (served by Next at /assets/...).
-- Idempotent: clears these content tables then re-inserts. Safe to re-run BEFORE
-- admins start creating their own records (it resets content rows only).

begin;

truncate table
  public.featured_items,
  public.impact_stats,
  public.social_proof,
  public.partners,
  public.testimonials,
  public.founder_story
restart identity;

-- Featured ("What's happening") ---------------------------------------------
insert into public.featured_items (title, description, category, cta_label, cta_url, position) values
('Web3 x AI Venture Builder — Now Open', 'Our flagship program is accepting applications. Build your MVP, grow your skills, and demo what you create.', 'Program', 'Apply Now', '/venture-builder', 0),
('Worktool Grant Applications Open', 'Apply or sponsor a work tool grant — laptops, internet, and software access for women builders who need it most.', 'Initiative', 'Learn More', '/partner', 1),
('AI x Web3: The Market Landscape and Opportunity', 'Knowledge sharing session in celebration of IWD 2026, our gift to the community.', 'Panel', 'See Events', '/events', 2);

-- Impact stats --------------------------------------------------------------
insert into public.impact_stats (value, label, description, position) values
('20,000+', 'women reached', 'We''ve shown up in the feeds, inboxes, and communities of over twenty thousand women across Africa and the UAE. That reach is growing every week.', 0),
('4,700+', 'community members', 'These are the women who chose to stay, joining our network, showing up to events, and building alongside each other in emerging technology.', 1),
('483+', 'accepted and trained', 'We don''t accept everyone. These are women who applied, were selected, and committed to structured learning through our cohort and venture builder programs.', 2),
('77+', 'graduates', 'Women who went all the way, completing full program tracks and shipping real projects at the end.', 3),
('49+', 'projects submitted', 'Real products. Real MVPs. Ideas that went from a conversation to something you can actually click on.', 4),
('50+', 'events hosted', 'Workshops, AMAs, masterclasses, and meetups where we put women in the same room as the ideas and people that matter.', 5);

-- Social proof ("Proof of work") --------------------------------------------
insert into public.social_proof (title, category, image_url, position) values
('Nofisat''s team won a prize at the Celo MiniPay Hack', 'Hackathon Win', '/assets/celo-hackathon-win-DXkh0P2H.jpg', 0),
('Nofisat received her HP laptop through our Worktool Program', 'Worktool Grant', '/assets/worktool-laptop-CC7TtD_m.jpg', 1),
('Amarachiugwu''s team won $1,500 at Web3 Lagos Conference', 'Hackathon Win', '/assets/web3lagos-win-DQTmc7vv.jpg', 2),
('Amarachiugwu created a SIWE tutorial after a Web3Ladies workshop', 'Workshop Impact', '/assets/siwe-workshop-gyz5A3vU.jpg', 3);

-- Partners ------------------------------------------------------------------
-- The five with real logo assets render in the marquee; the rest are name-only
-- (logos not recovered). Category logo_marquee = homepage strip.
insert into public.partners (name, logo_url, category, position) values
('Polygon', '/assets/polygon-2zd062MT.png', 'logo_marquee', 0),
('Celo', '/assets/celo-DCHEvpCA.png', 'logo_marquee', 1),
('Solana', '/assets/solana-DIiB-o-r.png', 'logo_marquee', 2),
('Ethereum Foundation', '/assets/ethereum-foundation-DLDjYPx9.png', 'logo_marquee', 3),
('Yellow Card', '/assets/yellowcard-DWXjHJ-Y.png', 'logo_marquee', 4),
('Nodo', null, 'logo_marquee', 5),
('Starknet', null, 'logo_marquee', 6),
('Base', null, 'logo_marquee', 7),
('Cartesi', null, 'logo_marquee', 8),
('Stellar / DSF Labs', null, 'logo_marquee', 9),
('Filecoin', null, 'past_partner', 10),
('SheCode Africa', null, 'past_partner', 11),
('Celo Foundation', null, 'past_partner', 12);

-- Founder story -------------------------------------------------------------
insert into public.founder_story (section_key, heading, body, image_url, position) values
('why', 'Why Web3Ladies exists',
 'I started Web3Ladies because when I transitioned into blockchain, I could clearly see two things at the same time: the immense opportunity Web3 was creating, new careers, new economies, new ways of building, and a painful gap: there were not enough women in the room, especially women who looked like me.

If the room did not naturally make space for more women, then I would help build a bigger room.

— Oluchi Enebeli, Founder, Web3Ladies',
 '/assets/founder-oluchi-BnQV3JEa.png', 0);

-- Testimonials --------------------------------------------------------------
-- 6 on the homepage ("Real stories…"), 3 on the community page.
insert into public.testimonials (name, role, quote, category, placement, position) values
('Nofisat Abiodun Ayanlola', 'Hackathon Winner', 'Consistency and having the right energy makes you excel — we won a prize on the Celo hack! Am excited to share our victory of winning a prize pool on our project #ChopConnect on the just concluded Celo hack on MiniPay, thanks to Web3Ladies.', 'Hackathon', 'home', 0),
('Community Member', 'Worktool Recipient', 'Thank you so much @web3ladies — this means a whole lot to me. I got my worktool alreadyyyy! The Work Tool Assistance Program gave me the device I needed to keep building. Without it, I would have been stuck watching from the sidelines.', 'Worktool', 'home', 1),
('Worktool Recipient', 'Community Member', 'I am thrilled to say that the reality is here — I just received my gift of an HP laptop from Web3Ladies! All my roadmap to this resilience — am grateful to Web3Ladies and everyone who made this possible.', 'Worktool', 'home', 2),
('Content Creator & Developer', 'Developer', 'I was inspired to create a YouTube video about Sign In With Ethereum after a Web3Ladies workshop. After joining a workshop by Johanna Fransson hosted by Web3Ladies on SIWE, I discussed the motivation and goal of sign in with Ethereum and the great options it brings.', 'Workshop', 'home', 3),
('Hackathon Winner', 'Builder', 'My team won the $1,500 prize pool at Web3 Lagos Conference under Lisk protocol! Thank you Web3Ladies — you all played significant roles in making this win possible. The skills and community gave me the foundation to compete and deliver.', 'Hackathon', 'home', 4),
('Solidity Developer', 'Solidity Developer', 'Over the past couple of months, I have witnessed sporadic growth in my tech journey and this is owing to the amazing mentorship Web3Ladies provided me.', 'Mentorship', 'home', 5),
('Web Developer', 'Web Developer', 'The mentorship helped me develop my organizational and technical skills along with personal development. I had the pleasure to be a mentee at Web3Ladies Cohort II for 4 months without prior knowledge of HTML, CSS, and JavaScript. The mentors have deep knowledge of teaching technical courses.', 'Cohort', 'community', 0),
('Web3 Developer', 'Web3 Developer', 'The cohort made me more eager to learn and provided me with a community to learn with. Prior to the cohort I had tried learning web3 development 2 times but didn''t remain consistent until I got into the cohort that provided me with people to look up to.', 'Cohort', 'community', 1),
('Crypto/DeFi Enthusiast', 'Crypto/DeFi Enthusiast', 'I had so many challenges but in the end, I bought my first coin during class. I also started saving in USDT. I am very grateful for the cohort.', 'Cohort', 'community', 2);

commit;


