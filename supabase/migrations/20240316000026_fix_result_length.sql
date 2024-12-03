-- Modify the result column to allow longer values
ALTER TABLE public.hands 
    ALTER COLUMN result TYPE varchar(20);

-- Update result check constraint
ALTER TABLE public.hands 
    DROP CONSTRAINT IF EXISTS hands_result_check,
    ADD CONSTRAINT hands_result_check CHECK (
        result IN ('player', 'banker', 'tie', 'playerNatural', 'bankerNatural')
    );