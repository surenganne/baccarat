-- First, drop all existing policies
drop policy if exists "user_tables_access" on public.tables;
drop policy if exists "admin_tables_access" on public.tables;
drop policy if exists "user_hands_access" on public.hands;
drop policy if exists "admin_hands_access" on public.hands;
drop policy if exists "user_logs_access" on public.activity_logs;
drop policy if exists "admin_logs_access" on public.activity_logs;

-- Create a single policy for tables that handles both users and admins
create policy "table_access_policy"
    on public.tables
    for all
    using (
        user_id = auth.uid() 
        or exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.is_admin = true
        )
    )
    with check (
        user_id = auth.uid() 
        or exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.is_admin = true
        )
    );

-- Create a single policy for hands
create policy "hands_access_policy"
    on public.hands
    for all
    using (
        exists (
            select 1 from public.tables t
            where t.id = hands.table_id
            and (
                t.user_id = auth.uid()
                or exists (
                    select 1 from public.users u
                    where u.id = auth.uid()
                    and u.is_admin = true
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
                    select 1 from public.users u
                    where u.id = auth.uid()
                    and u.is_admin = true
                )
            )
        )
    );

-- Create a single policy for activity logs
create policy "logs_access_policy"
    on public.activity_logs
    for all
    using (
        exists (
            select 1 from public.tables t
            where t.id = activity_logs.table_id
            and (
                t.user_id = auth.uid()
                or exists (
                    select 1 from public.users u
                    where u.id = auth.uid()
                    and u.is_admin = true
                )
            )
        )
    );