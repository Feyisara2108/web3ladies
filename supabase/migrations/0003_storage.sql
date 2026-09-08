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
