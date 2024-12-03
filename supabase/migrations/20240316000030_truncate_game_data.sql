-- Truncate game-related tables while preserving user data
begin;
  -- Truncate in reverse order of dependencies
  truncate table public.hands cascade;
  truncate table public.activity_logs cascade;
  truncate table public.tables cascade;
commit;