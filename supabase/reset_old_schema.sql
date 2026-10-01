-- Web3Ladies — ONE-TIME cleanup of the earlier (guessed) schema.
--
-- Only for a project that previously ran the old setup scripts (tables like
-- `profiles`, `forms`, `submissions`, `social_proof`). Run this FIRST, then
-- RUN_ALL.sql.
--
-- WARNING: permanently deletes those tables and everything in them, including
-- any form submissions saved by the old version of the site. Export anything
-- you want to keep (Table Editor → table → Export) before running.
--
-- Login accounts (Authentication → Users) and the `media` storage bucket and
-- its files are NOT deleted.

-- Old tables (cascade also removes their policies, triggers and indexes).
drop table if exists
  public.submission_values,
  public.submissions,
  public.form_field_options,
  public.form_fields,
  public.forms,
  public.media,
  public.profiles,
  public.featured_items,
  public.testimonials,
  public.events,
  public.cohorts,
  public.blog_posts,
  public.partners,
  public.social_proof,
  public.impact_stats,
  public.founder_story
cascade;

-- Old helper functions (cascade removes the old trigger on auth.users).
drop function if exists public.handle_new_user() cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.is_superadmin() cascade;
drop function if exists public.current_role() cascade;
drop function if exists public.set_updated_at() cascade;

-- Old role type had no 'user' value; the new schema recreates it.
drop type if exists public.app_role cascade;

-- Old storage policies (the new ones use different names).
drop policy if exists "media public read" on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin update" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;
