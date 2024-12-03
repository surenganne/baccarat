-- First, drop all existing policies
drop policy if exists "table_access_policy" on public.tables;
drop policy if exists "hands_access_policy" on public.hands;
drop policy if exists "logs_access_policy" on public.activity_logs;

-- Create simpler, more permissive policies for tables
create policy "table_access_policy"
    on public.tables
    for all
    using (
        -- User can access their own tables OR user is admin
        user_id = auth.uid() 
        or exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.is_admin = true
        )
    )
    with check (
        -- User can only create/modify their own tables OR user is admin
        user_id = auth.uid() 
        or exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.is_admin = true
        )
    );

-- Simpler policy for hands
create policy "hands_access_policy"
    on public.hands
    for all
    using (
        exists (
            select 1 from public.tables t
            join public.users u on u.id = auth.uid()
            where t.id = hands.table_id
            and (t.user_id = auth.uid() or u.is_admin = true)
        )
    )
    with check (
        exists (
            select 1 from public.tables t
            join public.users u on u.id = auth.uid()
            where t.id = table_id
            and t.status = 'active'
            and t.hands_count < 100
            and (t.user_id = auth.uid() or u.is_admin = true)
        )
    );

-- Simpler policy for activity logs
create policy "logs_access_policy"
    on public.activity_logs
    for all
    using (
        exists (
            select 1 from public.tables t
            join public.users u on u.id = auth.uid()
            where t.id = activity_logs.table_id
            and (t.user_id = auth.uid() or u.is_admin = true)
        )
    );