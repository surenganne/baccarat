-- Drop existing policies for hands table
drop policy if exists "Enable read access for all users" on public.hands;
drop policy if exists "Enable insert for all users" on public.hands;
drop policy if exists "Enable update for all users" on public.hands;
drop policy if exists "Enable delete for all users" on public.hands;

-- Create new policies for hands table that respect table ownership
create policy "Users can read hands for their tables"
on public.hands for select
using (
  exists (
    select 1 from public.tables
    where tables.id = hands.table_id
    and tables.user_id = auth.uid()
  )
);

create policy "Users can insert hands for their tables"
on public.hands for insert
with check (
  exists (
    select 1 from public.tables
    where tables.id = hands.table_id
    and tables.user_id = auth.uid()
  )
);

create policy "Users can update hands for their tables"
on public.hands for update
using (
  exists (
    select 1 from public.tables
    where tables.id = hands.table_id
    and tables.user_id = auth.uid()
  )
);

create policy "Users can delete hands for their tables"
on public.hands for delete
using (
  exists (
    select 1 from public.tables
    where tables.id = hands.table_id
    and tables.user_id = auth.uid()
  )
);

-- Drop existing policies for activity_logs table
drop policy if exists "Enable read access for all users" on public.activity_logs;
drop policy if exists "Enable insert for all users" on public.activity_logs;
drop policy if exists "Enable update for all users" on public.activity_logs;
drop policy if exists "Enable delete for all users" on public.activity_logs;

-- Create new policies for activity_logs table that respect table ownership
create policy "Users can read logs for their tables"
on public.activity_logs for select
using (
  exists (
    select 1 from public.tables
    where tables.id = activity_logs.table_id
    and tables.user_id = auth.uid()
  )
);

create policy "Users can insert logs for their tables"
on public.activity_logs for insert
with check (
  exists (
    select 1 from public.tables
    where tables.id = activity_logs.table_id
    and tables.user_id = auth.uid()
  )
);

-- Ensure tables policies are properly set
drop policy if exists "Enable table access" on public.tables;

create policy "Users can read their own tables"
on public.tables for select
using (user_id = auth.uid());

create policy "Users can insert their own tables"
on public.tables for insert
with check (user_id = auth.uid());

create policy "Users can update their own tables"
on public.tables for update
using (user_id = auth.uid());

create policy "Users can delete their own tables"
on public.tables for delete
using (user_id = auth.uid());