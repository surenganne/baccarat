-- Update result check constraint to handle Super 6
alter table public.hands 
    drop constraint if exists hands_result_check,
    add constraint hands_result_check check (
        result in ('player', 'banker', 'tie', 'playerNatural', 'bankerNatural', 'bankerSuper6')
    );