-- Tables table - Main table for managing baccarat tables
create table if not exists public.tables (
    id uuid primary key default uuid_generate_v4(),
    name varchar(255) not null,
    category varchar(100) default 'Default',
    status varchar(20) check (status in ('active', 'inactive', 'archived')) default 'active',
    location varchar(100),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    archived_at timestamptz,
    imported_at timestamptz
);

-- Hands table - Records game results
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

-- Activity logs table - Tracks table activities
create table if not exists public.activity_logs (
    id uuid primary key default uuid_generate_v4(),
    table_id uuid references public.tables(id) on delete cascade,
    type varchar(50) not null,
    details text not null,
    created_at timestamptz default now()
);

-- Create indexes for better query performance
create index if not exists idx_tables_status on public.tables(status);
create index if not exists idx_hands_table_id on public.hands(table_id);
create index if not exists idx_hands_created_at on public.hands(created_at);
create index if not exists idx_activity_logs_table_id on public.activity_logs(table_id);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at);