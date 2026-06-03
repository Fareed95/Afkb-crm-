-- 003_indexes.sql

create index if not exists shops_shop_name_idx on public.shops (shop_name);
create index if not exists shops_phone_idx on public.shops (phone_number);
create index if not exists garments_name_idx on public.garments (garment_name);
create index if not exists work_entries_shop_date_idx on public.work_entries (shop_id, work_date);
create index if not exists work_entry_items_entry_idx on public.work_entry_items (work_entry_id);
create index if not exists invoices_shop_date_idx on public.invoices (shop_id, invoice_date);
create index if not exists invoice_items_invoice_idx on public.invoice_items (invoice_id);
create index if not exists payments_shop_date_idx on public.payments (shop_id, payment_date);
create index if not exists ledger_shop_date_idx on public.ledger_entries (shop_id, entry_date);
create index if not exists adhoc_receipts_date_idx on public.adhoc_receipts (receipt_date);
