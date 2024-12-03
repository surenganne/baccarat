-- Add is_admin column to users table
alter table public.users
add column is_admin boolean default false;

-- Update RLS policies for tables to allow admin access
drop policy if exists "users_own_tables" on public.tables;
create policy "tables_access"
    on public.tables
    for all
    using (
        user_id = auth.uid() 
        or 
        exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.is_admin = true
        )
    )
    with check (
        user_id = auth.uid() 
        or 
        exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.is_admin = true
        )
    );

-- Update RLS policies for hands to allow admin access
drop policy if exists "users_own_hands" on public.hands;
create policy "hands_access"
    on public.hands
    for all
    using (
        exists (
            select 1 from public.tables t
            where t.id = hands.table_id
            and (
                t.user_id = auth.uid()
                or exists (
                    select 1 from public.users
                    where users.id = auth.uid()
                    and users.is_admin = true
                )
            )
        )
    )
    with check (
        exists (
            select 1 from public.tables t
            where t.id = table_id
            and t.status = 'active'
            and t.hands_count < 100
            and (
                t.user_id = auth.uid()
                or exists (
                    select 1 from public.users
                    where users.id = auth.uid()
                    and users.is_admin = true
                )
            )
        )
    );

-- Update RLS policies for activity logs to allow admin access
drop policy if exists "users_own_logs" on public.activity_logs;
create policy "logs_access"
    on public.activity_logs
    for all
    using (
        exists (
            select 1 from public.tables t
            where t.id = activity_logs.table_id
            and (
                t.user_id = auth.uid()
                or exists (
                    select 1 from public.users
                    where users.id = auth.uid()
                    and users.is_admin = true
                )
            )
        )
    );