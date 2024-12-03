-- First, list all tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Drop all existing tables in the correct order to handle dependencies
drop table if exists public.hands cascade;
drop table if exists public.activity_logs cascade;
drop table if exists public.policy_logs cascade;
drop table if exists public.policy_violations cascade;
drop table if exists public.tables cascade;
drop table if exists public.users cascade;

-- Drop any remaining functions
drop function if exists update_updated_at() cascade;
drop function if exists update_hands_count() cascade;
drop function if exists validate_hand_insert() cascade;
drop function if exists log_policy_violation() cascade;

-- Drop any remaining triggers
drop trigger if exists update_tables_updated_at on public.tables;
drop trigger if exists update_hands_updated_at on public.hands;
drop trigger if exists update_hands_count_trigger on public.hands;
drop trigger if exists validate_hand_insert_trigger on public.hands;
drop trigger if exists log_hands_violation on public.hands;

-- Now we can recreate the database with a clean slate using the previous migration
\i '20240316000013_recreate_database.sql';