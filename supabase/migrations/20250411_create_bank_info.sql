-- Create bank_info table
create table if not exists public.bank_info (
    id uuid default gen_random_uuid() primary key,
    bank_name text not null,
    rib text not null,
    iban text not null,
    swift text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.bank_info enable row level security;

-- Create policies
create policy "Enable read access for authenticated users" on public.bank_info
    for select using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" on public.bank_info
    for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users" on public.bank_info
    for update using (auth.role() = 'authenticated');

-- Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_bank_info_updated_at
    before update on public.bank_info
    for each row
    execute function public.handle_updated_at();
