-- 010_invoice_timestamps.sql
alter table public.invoice_items add column if not exists work_timestamp timestamptz;
alter table public.invoices add column if not exists timestamp_from timestamptz;
alter table public.invoices add column if not exists timestamp_to timestamptz;

-- Remove the obsolete six-argument overload so PostgREST has one unambiguous
-- create_invoice_with_items RPC signature.
drop function if exists public.create_invoice_with_items(
  uuid,
  date,
  date,
  date,
  uuid,
  jsonb
);

create or replace function public.create_invoice_with_items(
  p_shop_id uuid,
  p_date_from date,
  p_date_to date,
  p_invoice_date date,
  p_created_by uuid,
  p_items jsonb,
  p_timestamp_from timestamptz default null,
  p_timestamp_to timestamptz default null
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
  -- Get the next invoice number
  v_invoice_number := public.next_invoice_number(v_year);

  -- Sum up current items subtotal
  select coalesce(sum((item->>'amount')::numeric), 0)
  into v_subtotal
  from jsonb_array_elements(p_items) as item;

  -- Previous balance is simply the sum of all existing ledger entries for this shop (debit - credit)
  -- up to the current moment (before inserting the new invoice entry)
  select coalesce(sum(debit - credit), 0)
  into v_previous_balance
  from public.ledger_entries
  where shop_id = p_shop_id;

  -- Calculate credit applied if previous balance is negative (overpaid)
  if v_previous_balance < 0 then
    v_credit_applied := least(v_subtotal, abs(v_previous_balance));
  else
    v_credit_applied := 0;
  end if;

  -- Grand total = new charges + existing outstanding balance
  v_grand_total := v_subtotal + v_previous_balance;

  -- Insert the invoice
  insert into public.invoices (
    id,
    shop_id,
    invoice_number,
    invoice_date,
    date_from,
    date_to,
    timestamp_from,
    timestamp_to,
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
    p_timestamp_from,
    p_timestamp_to,
    v_subtotal,
    v_previous_balance,
    v_credit_applied,
    v_grand_total,
    p_created_by
  );

  -- Insert invoice items
  insert into public.invoice_items (
    invoice_id,
    work_entry_item_id,
    work_date,
    work_timestamp,
    garment_name,
    quantity,
    rate,
    amount
  )
  select
    v_invoice_id,
    (item->>'work_entry_item_id')::uuid,
    (item->>'work_date')::date,
    (item->>'work_timestamp')::timestamptz,
    item->>'garment_name',
    (item->>'quantity')::numeric,
    (item->>'rate')::numeric,
    (item->>'amount')::numeric
  from jsonb_array_elements(p_items) as item;

  -- Add ledger entry for this new invoice
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

grant execute on function public.create_invoice_with_items(
  uuid,
  date,
  date,
  date,
  uuid,
  jsonb,
  timestamptz,
  timestamptz
) to authenticated;

notify pgrst, 'reload schema';
