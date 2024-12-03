-- Create simple users table
create table if not exists public.users (
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

-- Add user_id to tables
alter table public.tables 
add column if not exists user_id uuid references public.users(id);

-- Create indexes
create index if not exists idx_users_username on public.users(username);
create index if not exists idx_users_mobile on public.users(mobile_number);

-- Enable RLS
alter table public.users enable row level security;

-- Create policies for users table
create policy "Users can read their own data"
    on public.users for select
    using (id = auth.uid());

create policy "Users can update their own data"
    on public.users for update
    using (id = auth.uid());

-- Update table policies to use user_id
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