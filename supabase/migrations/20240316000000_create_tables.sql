-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Drop existing triggers and functions if they exist
drop trigger if exists update_tables_updated_at on public.tables;
drop trigger if exists update_hands_updated_at on public.hands;
drop function if exists update_updated_at_column();

-- Tables table
create table if not exists public.tables (
    id uuid primary key default uuid_generate_v4(),
    name varchar(255) not null,
    category varchar(100) default 'Default',
    status varchar(20) check (status in ('active', 'archived')) default 'active',
    location varchar(100),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    archived_at timestamptz,
    imported_at timestamptz
);

-- Hands table
create table if not exists public.hands (
    id uuid primary key default uuid_generate_v4(),
    table_id uuid references public.tables(id) on delete cascade,
    result varchar(10) check (result in ('player', 'banker', 'tie')) not null,
    is_natural boolean default false,
    pairs varchar(10) check (pairs in ('none', 'player', 'banker', 'both')) default 'none',
    player_score smallint check (player_score >= 0 and player_score <= 9),
    banker_score smallint check (banker_score >= 0 and banker_score <= 9),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Activity logs table
create table if not exists public.activity_logs (
    id uuid primary key default uuid_generate_v4(),
    table_id uuid references public.tables(id) on delete cascade,
    type varchar(50) not null,
    details text not null,
    created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_tables_status on public.tables(status);
create index if not exists idx_hands_table_id on public.hands(table_id);
create index if not exists idx_hands_created_at on public.hands(created_at);
create index if not exists idx_activity_logs_table_id on public.activity_logs(table_id);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at);

-- Updated at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add triggers for updated_at
create trigger update_tables_updated_at
    before update on public.tables
    for each row
    execute function update_updated_at_column();

create trigger update_hands_updated_at
    before update on public.hands
    for each row
    execute function update_updated_at_column();

-- Enable Row Level Security (RLS)
alter table public.tables enable row level security;
alter table public.hands enable row level security;
alter table public.activity_logs enable row level security;

-- Drop existing policies
drop policy if exists "Enable read access for all users" on public.tables;
drop policy if exists "Enable insert for all users" on public.tables;
drop policy if exists "Enable update for all users" on public.tables;
drop policy if exists "Enable delete for all users" on public.tables;

drop policy if exists "Enable read access for all users" on public.hands;
drop policy if exists "Enable insert for all users" on public.hands;
drop policy if exists "Enable update for all users" on public.hands;
drop policy if exists "Enable delete for all users" on public.hands;

drop policy if exists "Enable read access for all users" on public.activity_logs;
drop policy if exists "Enable insert for all users" on public.activity_logs;
drop policy if exists "Enable update for all users" on public.activity_logs;
drop policy if exists "Enable delete for all users" on public.activity_logs;

-- Create policies
create policy "Enable read access for all users"
    on public.tables for select
    using (true);

create policy "Enable insert for all users"
    on public.tables for insert
    with check (true);

create policy "Enable update for all users"
    on public.tables for update
    using (true);

create policy "Enable delete for all users"
    on public.tables for delete
    using (true);

-- Repeat for hands table
create policy "Enable read access for all users"
    on public.hands for select
    using (true);

create policy "Enable insert for all users"
    on public.hands for insert
    with check (true);

create policy "Enable update for all users"
    on public.hands for update
    using (true);

create policy "Enable delete for all users"
    on public.hands for delete
    using (true);

-- Repeat for activity_logs table
create policy "Enable read access for all users"
    on public.activity_logs for select
    using (true);

create policy "Enable insert for all users"
    on public.activity_logs for insert
    with check (true);

create policy "Enable update for all users"
    on public.activity_logs for update
    using (true);

create policy "Enable delete for all users"
    on public.activity_logs for delete
    using (true);