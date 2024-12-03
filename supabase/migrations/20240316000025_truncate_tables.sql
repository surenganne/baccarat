-- Truncate all tables in a single transaction with cascade
begin;
  -- Truncate in reverse order of dependencies
  truncate table public.hands, 
                public.activity_logs, 
                public.tables, 
                public.users 
  cascade;
commit;