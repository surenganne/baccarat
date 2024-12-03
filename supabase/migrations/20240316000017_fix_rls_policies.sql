-- First, drop existing policies
drop policy if exists "tables_access" on public.tables;
drop policy if exists "hands_access" on public.hands;
drop policy if exists "logs_access" on public.activity_logs;

-- Create separate policies for regular users and admins
create policy "user_tables_access"
    on public.tables
    for all
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy "admin_tables_access"
    on public.tables
    for all
    using (
        exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.is_admin = true
        )
    )
    with check (
        exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.is_admin = true
        )
    );

-- Update hands policies
create policy "user_hands_access"
    on public.hands
    for all
    using (
        exists (
            select 1 from public.tables t
            where t.id = hands.table_id
            and t.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.tables t
            where t.id = table_id
            and t.user_id = auth.uid()
            and t.status = 'active'
            and t.hands_count < 100
        )
    );

create policy "admin_hands_access"
    on public.hands
    for all
    using (
        exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.is_admin = true
        )
    )
    with check (
        exists (
            select 1 from public.tables t
            where t.id = table_id
            and t.status = 'active'
            and t.hands_count < 100
        )
    );

-- Update activity logs policies
create policy "user_logs_access"
    on public.activity_logs
    for all
    using (
        exists (
            select 1 from public.tables t
            where t.id = activity_logs.table_id
            and t.user_id = auth.uid()
        )
    );

create policy "admin_logs_access"
    on public.activity_logs
    for all
    using (
        exists (
            select 1 from public.users
            where users.id = auth.uid()
            and users.is_admin = true
        )
    );