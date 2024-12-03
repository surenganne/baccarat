-- First, drop any indexes that might reference the location column
drop index if exists idx_tables_location;

-- Remove the location column from tables
alter table public.tables
drop column if exists location;