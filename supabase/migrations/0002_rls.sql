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
