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
