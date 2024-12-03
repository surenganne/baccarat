-- Delete tables with 0 hands
delete from public.tables
where hands_count = 0;

-- Create trigger to auto-delete tables with 0 hands when archived
create or replace function delete_empty_archived_table()
returns trigger as $$
begin
    if NEW.status = 'archived' and NEW.hands_count = 0 then
        delete from public.tables where id = NEW.id;
        return null;  -- Don't perform the update since we deleted the record
    end if;
    return NEW;
end;
$$ language plpgsql;

-- Drop trigger if it exists
drop trigger if exists delete_empty_archived_table_trigger on public.tables;

-- Create trigger
create trigger delete_empty_archived_table_trigger
    before update on public.tables
    for each row
    execute function delete_empty_archived_table();