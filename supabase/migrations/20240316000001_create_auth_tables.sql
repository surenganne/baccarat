-- Create users table
create table if not exists public.users (
    id uuid primary key default uuid_generate_v4(),
    username varchar(50) unique,
    mobile_number varchar(15) unique,
    pin varchar(60) not null, -- Will store hashed PIN
    created_at timestamptz default now(),
    last_login timestamptz
);

-- Add user_id to tables for ownership
alter table public.tables 
add column if not exists user_id uuid references public.users(id);

-- Update RLS policies for tables
drop policy if exists "Enable read access for all users" on public.tables;
create policy "Enable read access for authenticated users"
on public.tables for select
using (auth.uid() = user_id);

create policy "Enable insert for authenticated users"
on public.tables for insert
with check (auth.uid() = user_id);

create policy "Enable update for table owners"
on public.tables for update
using (auth.uid() = user_id);

create policy "Enable delete for table owners"
on public.tables for delete
using (auth.uid() = user_id);