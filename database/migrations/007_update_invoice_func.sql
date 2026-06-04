-- 007_update_invoice_func.sql
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
