-- Revert previous changes
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop table if exists public.profiles;
alter table auth.users drop column if exists username;

-- Clean up any existing auth-related changes
drop trigger if exists update_users_updated_at on public.users;
drop policy if exists "Enable read access for authenticated users" on public.tables;
drop policy if exists "Enable insert for authenticated users" on public.tables;
drop policy if exists "Enable update for table owners" on public.tables;
drop policy if exists "Enable delete for table owners" on public.tables;

-- Remove user_id from tables if it exists
alter table public.tables drop column if exists user_id;