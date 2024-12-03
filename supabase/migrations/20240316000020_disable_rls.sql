-- Disable RLS on all tables
alter table public.tables disable row level security;
alter table public.hands disable row level security;
alter table public.activity_logs disable row level security;

-- Drop all existing policies
drop policy if exists "table_access_policy" on public.tables;
drop policy if exists "hands_access_policy" on public.hands;
drop policy if exists "logs_access_policy" on public.activity_logs;

-- Add indexes to improve query performance
create index if not exists idx_tables_user_id on public.tables(user_id);
create index if not exists idx_tables_status on public.tables(status);
create index if not exists idx_hands_table_id on public.hands(table_id);
create index if not exists idx_activity_logs_table_id on public.activity_logs(table_id);