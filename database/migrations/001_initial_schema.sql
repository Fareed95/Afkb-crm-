-- 001_initial_schema.sql

create extension if not exists "pgcrypto";

create type public.payment_mode as enum (
  'cash',
  'upi',
  'bank_transfer',
  'cheque'
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text not null check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  shop_name text not null,
  phone_number text not null,
  email text,
  address text,
  notes text,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_events (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops on delete cascade,
  event_type text not null,
  summary text not null,
  created_by uuid references auth.users,
  created_at timestamptz not null default now()
);

create table if not exists public.garments (
  id uuid primary key default gen_random_uuid(),
  garment_name text not null,
  default_rate numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_garment_rates (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops on delete cascade,
  garment_id uuid not null references public.garments on delete cascade,
  rate numeric(12,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shop_id, garment_id)
);

create table if not exists public.work_entries (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops on delete cascade,
  work_date date not null,
  remarks text,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_entry_items (
  id uuid primary key default gen_random_uuid(),
  work_entry_id uuid not null references public.work_entries on delete cascade,
  garment_id uuid references public.garments,
  garment_name text not null,
  quantity numeric(12,2) not null,
  rate numeric(12,2) not null,
  amount numeric(12,2) not null
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops on delete cascade,
  invoice_number text not null unique,
  invoice_date date not null,
  date_from date not null,
  date_to date not null,
  subtotal numeric(12,2) not null,
  previous_balance numeric(12,2) not null default 0,
  credit_applied numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices on delete cascade,
  work_entry_item_id uuid references public.work_entry_items,
  work_date date not null,
  garment_name text not null,
  quantity numeric(12,2) not null,
  rate numeric(12,2) not null,
  amount numeric(12,2) not null,
  unique (work_entry_item_id)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops on delete cascade,
  amount numeric(12,2) not null,
  payment_mode public.payment_mode not null,
  remarks text,
  payment_date date not null,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops on delete cascade,
  entry_date date not null,
  description text not null,
  debit numeric(12,2) not null default 0,
  credit numeric(12,2) not null default 0,
  source_type text not null,
  source_id uuid,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  check (debit >= 0),
  check (credit >= 0)
);

create table if not exists public.adhoc_receipts (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text,
  work_description text not null,
  amount numeric(12,2) not null,
  receipt_date date not null,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_counters (
  year int primary key,
  last_number int not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.next_invoice_number(p_year int)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_counter int;
  v_number text;
begin
  insert into public.invoice_counters(year, last_number)
  values (p_year, 0)
  on conflict (year) do nothing;

  select last_number into v_counter
  from public.invoice_counters
  where year = p_year
  for update;

  v_counter := coalesce(v_counter, 0) + 1;

  update public.invoice_counters
  set last_number = v_counter,
      updated_at = now()
  where year = p_year;

  v_number := 'AFKB-' || p_year::text || '-' || lpad(v_counter::text, 5, '0');

  return v_number;
end;
$$;

create or replace function public.get_shop_balance(p_shop_id uuid, p_as_of date)
returns numeric
language sql
stable
as $$
  select coalesce(sum(debit - credit), 0)
  from public.ledger_entries
  where shop_id = p_shop_id
    and entry_date <= p_as_of;
$$;

create or replace function public.create_invoice_with_items(
  p_shop_id uuid,
  p_date_from date,
  p_date_to date,
  p_invoice_date date,
  p_created_by uuid,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year int := extract(year from p_invoice_date);
  v_invoice_number text;
  v_subtotal numeric(12,2);
  v_previous_balance numeric(12,2);
  v_credit_applied numeric(12,2);
  v_grand_total numeric(12,2);
  v_invoice_id uuid := gen_random_uuid();
begin
  v_invoice_number := public.next_invoice_number(v_year);

  select coalesce(sum((item->>'amount')::numeric), 0)
  into v_subtotal
  from jsonb_array_elements(p_items) as item;

  select coalesce(sum(debit - credit), 0)
  into v_previous_balance
  from public.ledger_entries
  where shop_id = p_shop_id
    and entry_date < p_invoice_date;

  if v_previous_balance < 0 then
    v_credit_applied := least(v_subtotal, abs(v_previous_balance));
  else
    v_credit_applied := 0;
  end if;

  v_grand_total := v_subtotal + v_previous_balance;

  insert into public.invoices (
    id,
    shop_id,
    invoice_number,
    invoice_date,
    date_from,
    date_to,
    subtotal,
    previous_balance,
    credit_applied,
    grand_total,
    created_by
  ) values (
    v_invoice_id,
    p_shop_id,
    v_invoice_number,
    p_invoice_date,
    p_date_from,
    p_date_to,
    v_subtotal,
    v_previous_balance,
    v_credit_applied,
    v_grand_total,
    p_created_by
  );

  insert into public.invoice_items (
    invoice_id,
    work_entry_item_id,
    work_date,
    garment_name,
    quantity,
    rate,
    amount
  )
  select
    v_invoice_id,
    (item->>'work_entry_item_id')::uuid,
    (item->>'work_date')::date,
    item->>'garment_name',
    (item->>'quantity')::numeric,
    (item->>'rate')::numeric,
    (item->>'amount')::numeric
  from jsonb_array_elements(p_items) as item;

  insert into public.ledger_entries (
    shop_id,
    entry_date,
    description,
    debit,
    credit,
    source_type,
    source_id,
    created_by
  ) values (
    p_shop_id,
    p_invoice_date,
    'Invoice ' || v_invoice_number,
    v_subtotal,
    0,
    'invoice',
    v_invoice_id,
    p_created_by
  );

  return v_invoice_id;
end;
$$;

create or replace function public.record_payment(
  p_shop_id uuid,
  p_amount numeric,
  p_payment_mode text,
  p_remarks text,
  p_payment_date date,
  p_created_by uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment_id uuid := gen_random_uuid();
begin
  insert into public.payments (
    id,
    shop_id,
    amount,
    payment_mode,
    remarks,
    payment_date,
    created_by
  ) values (
    v_payment_id,
    p_shop_id,
    p_amount,
    p_payment_mode::public.payment_mode,
    p_remarks,
    p_payment_date,
    p_created_by
  );

  insert into public.ledger_entries (
    shop_id,
    entry_date,
    description,
    debit,
    credit,
    source_type,
    source_id,
    created_by
  ) values (
    p_shop_id,
    p_payment_date,
    'Payment received',
    0,
    p_amount,
    'payment',
    v_payment_id,
    p_created_by
  );

  return v_payment_id;
end;
$$;

create trigger shops_set_updated_at
before update on public.shops
for each row execute function public.set_updated_at();

create trigger garments_set_updated_at
before update on public.garments
for each row execute function public.set_updated_at();

create trigger rates_set_updated_at
before update on public.shop_garment_rates
for each row execute function public.set_updated_at();

create trigger work_entries_set_updated_at
before update on public.work_entries
for each row execute function public.set_updated_at();

create trigger invoices_set_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create trigger adhoc_receipts_set_updated_at
before update on public.adhoc_receipts
for each row execute function public.set_updated_at();

grant execute on function public.next_invoice_number to authenticated;
grant execute on function public.get_shop_balance to authenticated;
grant execute on function public.create_invoice_with_items to authenticated;
grant execute on function public.record_payment to authenticated;
