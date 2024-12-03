-- First, disable RLS temporarily to clean up
alter table public.tables disable row level security;
alter table public.hands disable row level security;
alter table public.activity_logs disable row level security;

-- Drop all existing policies
drop policy if exists "table_access_policy" on public.tables;
drop policy if exists "hands_access_policy" on public.hands;
drop policy if exists "logs_access_policy" on public.activity_logs;

-- Re-enable RLS
alter table public.tables enable row level security;
alter table public.hands enable row level security;
alter table public.activity_logs enable row level security;

-- Create simplified table access policy
create policy "table_access_policy"
on public.tables
for all
using (
    user_id = auth.uid() or 
    exists (
        select 1 from public.users
        where id = auth.uid() and is_admin = true
    )
);

-- Create simplified hands access policy
create policy "hands_access_policy"
on public.hands
for all
using (
    exists (
        select 1 from public.tables t
        where t.id = table_id
        and (
            t.user_id = auth.uid() or
            exists (
                select 1 from public.users
                where id = auth.uid() and is_admin = true
            )
        )
    )
);

-- Create simplified activity logs policy
create policy "logs_access_policy"
on public.activity_logs
for all
using (
    exists (
        select 1 from public.tables t
        where t.id = table_id
        and (
            t.user_id = auth.uid() or
            exists (
                select 1 from public.users
                where id = auth.uid() and is_admin = true
            )
        )
    )
);