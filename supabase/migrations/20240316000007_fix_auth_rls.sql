-- Drop existing policies
drop policy if exists "Users can access their own tables" on public.tables;
drop policy if exists "Users can read their own tables" on public.tables;
drop policy if exists "Users can insert their own tables" on public.tables;
drop policy if exists "Users can update their own tables" on public.tables;
drop policy if exists "Users can delete their own tables" on public.tables;

-- Enable RLS
alter table public.tables enable row level security;

-- Create new policies for authenticated users
create policy "authenticated_users_select"
on public.tables for select
using (auth.uid() = user_id);

create policy "authenticated_users_insert"
on public.tables for insert
with check (auth.uid() = user_id);

create policy "authenticated_users_update"
on public.tables for update
using (auth.uid() = user_id);

create policy "authenticated_users_delete"
on public.tables for delete
using (auth.uid() = user_id);

-- Update hands policies
drop policy if exists "Users can read hands for their tables" on public.hands;
drop policy if exists "Users can insert hands for active tables" on public.hands;

create policy "authenticated_users_select_hands"
on public.hands for select
using (
    exists (
        select 1 from public.tables t
        where t.id = table_id
        and t.user_id = auth.uid()
    )
);

create policy "authenticated_users_insert_hands"
on public.hands for insert
with check (
    exists (
        select 1 from public.tables t
        where t.id = table_id
        and t.user_id = auth.uid()
        and t.status = 'active'
        and t.hands_count < 100
    )
);