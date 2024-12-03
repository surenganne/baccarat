-- Update result check constraint to handle natural wins
alter table public.hands 
    drop constraint if exists hands_result_check,
    add constraint hands_result_check check (
        result in ('player', 'banker', 'tie', 'playerNatural', 'bankerNatural')
    );

-- Add missing columns if they don't exist
alter table public.hands 
    add column if not exists player_score smallint check (player_score >= 0 and player_score <= 9),
    add column if not exists banker_score smallint check (banker_score >= 0 and banker_score <= 9);

-- Update pairs constraint
alter table public.hands 
    drop constraint if exists hands_pairs_check,
    add constraint hands_pairs_check check (pairs in ('none', 'player', 'banker', 'both'));

-- Add or update not null constraints
alter table public.hands 
    alter column table_id set not null,
    alter column result set not null;

-- Add or update default values
alter table public.hands 
    alter column is_natural set default false,
    alter column pairs set default 'none',
    alter column created_at set default now();

-- Ensure index exists
create index if not exists idx_hands_table_id on public.hands(table_id);