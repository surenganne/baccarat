-- First clean up any existing policies
drop policy if exists "users_own_tables" on public.tables;
drop policy if exists "users_own_hands" on public.hands;
drop policy if exists "users_own_logs" on public.activity_logs;

-- Enable RLS on main tables
alter table public.tables enable row level security;
alter table public.hands enable row level security;
alter table public.activity_logs enable row level security;

-- Create policies for tables
create policy "users_own_tables"
on public.tables for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Create policies for hands
create policy "users_own_hands"
on public.hands for all
using (
    exists (
        select 1 from public.tables
        where tables.id = hands.table_id
        and tables.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1 from public.tables
        where tables.id = table_id
        and tables.user_id = auth.uid()
        and tables.status = 'active'
        and tables.hands_count < 100
    )
);

-- Create policies for activity logs
create policy "users_own_logs"
on public.activity_logs for all
using (
    exists (
        select 1 from public.tables
        where tables.id = activity_logs.table_id
        and tables.user_id = auth.uid()
    )
);