-- Drop existing restrictive policies
drop policy if exists "Users can read their own data" on public.users;
drop policy if exists "Users can update their own data" on public.users;

-- Create more permissive policies for users table
create policy "Enable registration"
    on public.users for insert
    with check (true);

create policy "Enable login lookup"
    on public.users for select
    using (true);

create policy "Users can update their own data"
    on public.users for update
    using (true);

-- Update table policies to be more permissive during development
drop policy if exists "Users can read their own tables" on public.tables;
drop policy if exists "Users can insert their own tables" on public.tables;
drop policy if exists "Users can update their own tables" on public.tables;
drop policy if exists "Users can delete their own tables" on public.tables;

create policy "Enable table access"
    on public.tables for all
    using (true)
    with check (true);