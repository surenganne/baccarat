-- Disable RLS on all tables
alter table public.tables disable row level security;
alter table public.hands disable row level security;
alter table public.activity_logs disable row level security;
alter table public.users disable row level security;

-- Drop all existing policies
drop policy if exists "authenticated_users_select" on public.tables;
drop policy if exists "authenticated_users_insert" on public.tables;
drop policy if exists "authenticated_users_update" on public.tables;
drop policy if exists "authenticated_users_delete" on public.tables;

drop policy if exists "authenticated_users_select_hands" on public.hands;
drop policy if exists "authenticated_users_insert_hands" on public.hands;

drop policy if exists "Users can read logs for their tables" on public.activity_logs;
drop policy if exists "Users can insert logs for their tables" on public.activity_logs;

drop policy if exists "Enable login lookup" on public.users;
drop policy if exists "Enable registration" on public.users;
drop policy if exists "Users can update their own data" on public.users;