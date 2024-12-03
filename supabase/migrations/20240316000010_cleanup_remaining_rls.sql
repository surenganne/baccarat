-- Disable RLS on remaining tables
alter table public.policy_logs disable row level security;
alter table public.users disable row level security;

-- Drop remaining policies
drop policy if exists "No deletions of activity logs" on public.activity_logs;
drop policy if exists "No updates to activity logs" on public.activity_logs;
drop policy if exists "Users can see logs for visible tables" on public.activity_logs;
drop policy if exists "policy_logs_access" on public.policy_logs;

-- Drop dependent views first
drop view if exists policy_violations;

-- Drop dependent tables
drop table if exists public.hands;
drop table if exists public.activity_logs;

-- Now recreate all tables in correct order
create table if not exists public.tables (
    id uuid primary key default uuid_generate_v4(),
    name varchar(255) not null,
    category varchar(100) default 'Default',
    status varchar(20) check (status in ('active', 'archived')) default 'active',
    location varchar(100),
    user_id uuid references public.users(id),
    hands_count int default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    archived_at timestamptz,
    imported_at timestamptz
);

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

create table if not exists public.activity_logs (
    id uuid primary key default uuid_generate_v4(),
    table_id uuid references public.tables(id) on delete cascade,
    type varchar(50) not null,
    details text not null,
    created_at timestamptz default now()
);