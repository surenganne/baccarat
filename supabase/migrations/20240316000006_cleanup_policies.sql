-- First, clean up conflicting policies
drop policy if exists "Enable read access for all users" on public.tables;
drop policy if exists "Enable insert for all users" on public.tables;
drop policy if exists "Enable update for all users" on public.tables;
drop policy if exists "Enable delete for all users" on public.tables;
drop policy if exists "Users can see their own active tables" on public.tables;

-- Create a single, clear policy for table access
create policy "Users can access their own tables"
on public.tables for select
using (
    (user_id = auth.uid() and status = 'active') or
    (user_id = auth.uid() and status = 'archived')
);

-- Add hands_count column if it doesn't exist
alter table public.tables 
add column if not exists hands_count int default 0;

-- Create or replace the hands count update function
create or replace function public.update_hands_count()
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

-- Ensure the trigger exists
drop trigger if exists update_hands_count_trigger on public.hands;
create trigger update_hands_count_trigger
    after insert or delete on public.hands
    for each row
    execute function update_hands_count();

-- Update hands policies to be more specific
drop policy if exists "hands_read" on public.hands;
drop policy if exists "hands_write" on public.hands;

create policy "Users can read hands for their tables"
on public.hands for select
using (
    exists (
        select 1 from public.tables t
        where t.id = hands.table_id
        and t.user_id = auth.uid()
    )
);

create policy "Users can insert hands for active tables"
on public.hands for insert
with check (
    exists (
        select 1 from public.tables t
        where t.id = hands.table_id
        and t.user_id = auth.uid()
        and t.status = 'active'
        and t.hands_count < 100
    )
);

-- Function to validate hand insertion
create or replace function validate_hand_insert()
returns trigger as $$
begin
    if exists (
        select 1 from public.tables t
        where t.id = NEW.table_id
        and t.hands_count >= 100
    ) then
        raise exception 'Table has reached maximum hand limit of 100';
    end if;
    return NEW;
end;
$$ language plpgsql;

-- Create trigger for hand validation
drop trigger if exists validate_hand_insert_trigger on public.hands;
create trigger validate_hand_insert_trigger
    before insert on public.hands
    for each row
    execute function validate_hand_insert();