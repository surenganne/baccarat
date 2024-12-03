-- Drop existing tables (if any)
drop table if exists public.hands cascade;
drop table if exists public.activity_logs cascade;
drop table if exists public.tables cascade;
drop table if exists public.users cascade;

-- Create users table
create table public.users (
    id uuid primary key default uuid_generate_v4(),
    username varchar(50) unique,
    mobile_number varchar(15) unique,
    pin varchar(60) not null,
    created_at timestamptz default now(),
    last_login timestamptz,
    constraint username_or_mobile_required check (
        username is not null or mobile_number is not null
    )
);

-- Create tables table
create table public.tables (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) not null,
    name varchar(255) not null,
    category varchar(100) default 'Default',
    status varchar(20) check (status in ('active', 'archived')) default 'active',
    location varchar(100),
    hands_count int default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    archived_at timestamptz
);

-- Create hands table
create table public.hands (
    id uuid primary key default uuid_generate_v4(),
    table_id uuid references public.tables(id) on delete cascade not null,
    result varchar(10) check (result in ('player', 'banker', 'tie')) not null,
    is_natural boolean default false,
    pairs varchar(10) check (pairs in ('none', 'player', 'banker', 'both')) default 'none',
    player_score smallint check (player_score >= 0 and player_score <= 9),
    banker_score smallint check (banker_score >= 0 and banker_score <= 9),
    created_at timestamptz default now()
);

-- Create activity_logs table
create table public.activity_logs (
    id uuid primary key default uuid_generate_v4(),
    table_id uuid references public.tables(id) on delete cascade not null,
    type varchar(50) not null,
    details text not null,
    created_at timestamptz default now()
);

-- Create indexes
create index idx_tables_user_id on public.tables(user_id);
create index idx_tables_status on public.tables(status);
create index idx_hands_table_id on public.hands(table_id);
create index idx_activity_logs_table_id on public.activity_logs(table_id);

-- Create updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create hands_count trigger function
create or replace function update_hands_count()
returns trigger as $$
begin
    if (TG_OP = 'INSERT') then
        update public.tables 
        set hands_count = hands_count + 1
        where id = NEW.table_id;
        return NEW;
    elsif (TG_OP = 'DELETE') then
        update public.tables 
        set hands_count = hands_count - 1
        where id = OLD.table_id;
        return OLD;
    end if;
    return null;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger update_tables_updated_at
    before update on public.tables
    for each row
    execute function update_updated_at();

create trigger update_hands_count
    after insert or delete on public.hands
    for each row
    execute function update_hands_count();

-- Enable Row Level Security
alter table public.tables enable row level security;
alter table public.hands enable row level security;
alter table public.activity_logs enable row level security;

-- Create RLS policies for tables
create policy "users_own_tables"
    on public.tables
    for all
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

-- Create RLS policies for hands
create policy "users_own_hands"
    on public.hands
    for select
    using (exists (
        select 1 from public.tables
        where tables.id = hands.table_id
        and tables.user_id = auth.uid()
    ));

create policy "users_insert_hands"
    on public.hands
    for insert
    with check (exists (
        select 1 from public.tables
        where tables.id = table_id
        and tables.user_id = auth.uid()
        and tables.status = 'active'
        and tables.hands_count < 100
    ));

-- Create RLS policies for activity logs
create policy "users_own_logs"
    on public.activity_logs
    for select
    using (exists (
        select 1 from public.tables
        where tables.id = activity_logs.table_id
        and tables.user_id = auth.uid()
    ));

create policy "users_insert_logs"
    on public.activity_logs
    for insert
    with check (exists (
        select 1 from public.tables
        where tables.id = table_id
        and tables.user_id = auth.uid()
    ));