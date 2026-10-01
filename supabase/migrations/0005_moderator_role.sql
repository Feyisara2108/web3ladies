-- Web3Ladies — add the 'moderator' role offered by the admin's User Management.
-- Safe to run on a project that already ran the earlier scripts.

alter type public.app_role add value if not exists 'moderator' before 'admin';
