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
