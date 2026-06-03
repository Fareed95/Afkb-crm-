-- 002_rls.sql

alter table public.profiles enable row level security;
alter table public.shops enable row level security;
alter table public.shop_events enable row level security;
alter table public.garments enable row level security;
alter table public.shop_garment_rates enable row level security;
alter table public.work_entries enable row level security;
alter table public.work_entry_items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.adhoc_receipts enable row level security;
alter table public.invoice_counters enable row level security;

create or replace function public.get_user_role()
returns text
language sql
stable
as $$
  select role from public.profiles where user_id = auth.uid();
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
as $$
  select public.get_user_role() = 'owner';
$$;

create or replace function public.is_staff_or_owner()
returns boolean
language sql
stable
as $$
  select public.get_user_role() in ('owner', 'staff');
$$;

create policy "Profiles are visible to self or owner" on public.profiles
for select using (auth.uid() = user_id or public.is_owner());

create policy "Profiles can be inserted by self" on public.profiles
for insert with check (auth.uid() = user_id);

create policy "Profiles can be updated by self" on public.profiles
for update using (auth.uid() = user_id);

create policy "Shops readable by staff" on public.shops
for select using (public.is_staff_or_owner());

create policy "Shops managed by owner" on public.shops
for insert with check (public.is_owner());

create policy "Shops updated by owner" on public.shops
for update using (public.is_owner());

create policy "Shops deleted by owner" on public.shops
for delete using (public.is_owner());

create policy "Shop events readable by staff" on public.shop_events
for select using (public.is_staff_or_owner());

create policy "Shop events inserted by owner" on public.shop_events
for insert with check (public.is_owner());

create policy "Garments readable by staff" on public.garments
for select using (public.is_staff_or_owner());

create policy "Garments managed by owner" on public.garments
for insert with check (public.is_owner());

create policy "Garments updated by owner" on public.garments
for update using (public.is_owner());

create policy "Garments deleted by owner" on public.garments
for delete using (public.is_owner());

create policy "Rates readable by staff" on public.shop_garment_rates
for select using (public.is_staff_or_owner());

create policy "Rates managed by owner" on public.shop_garment_rates
for insert with check (public.is_owner());

create policy "Rates updated by owner" on public.shop_garment_rates
for update using (public.is_owner());

create policy "Rates deleted by owner" on public.shop_garment_rates
for delete using (public.is_owner());

create policy "Work entries readable by staff" on public.work_entries
for select using (public.is_staff_or_owner());

create policy "Work entries inserted by staff" on public.work_entries
for insert with check (public.is_staff_or_owner());

create policy "Work entries updated by owner" on public.work_entries
for update using (public.is_owner());

create policy "Work entries deleted by owner" on public.work_entries
for delete using (public.is_owner());

create policy "Work entry items readable by staff" on public.work_entry_items
for select using (public.is_staff_or_owner());

create policy "Work entry items inserted by staff" on public.work_entry_items
for insert with check (public.is_staff_or_owner());

create policy "Work entry items updated by owner" on public.work_entry_items
for update using (public.is_owner());

create policy "Work entry items deleted by owner" on public.work_entry_items
for delete using (public.is_owner());

create policy "Invoices readable by staff" on public.invoices
for select using (public.is_staff_or_owner());

create policy "Invoices inserted by owner" on public.invoices
for insert with check (public.is_owner());

create policy "Invoices updated by owner" on public.invoices
for update using (public.is_owner());

create policy "Invoices deleted by owner" on public.invoices
for delete using (public.is_owner());

create policy "Invoice items readable by staff" on public.invoice_items
for select using (public.is_staff_or_owner());

create policy "Invoice items inserted by owner" on public.invoice_items
for insert with check (public.is_owner());

create policy "Invoice items updated by owner" on public.invoice_items
for update using (public.is_owner());

create policy "Invoice items deleted by owner" on public.invoice_items
for delete using (public.is_owner());

create policy "Payments readable by staff" on public.payments
for select using (public.is_staff_or_owner());

create policy "Payments inserted by owner" on public.payments
for insert with check (public.is_owner());

create policy "Payments updated by owner" on public.payments
for update using (public.is_owner());

create policy "Payments deleted by owner" on public.payments
for delete using (public.is_owner());

create policy "Ledger readable by staff" on public.ledger_entries
for select using (public.is_staff_or_owner());

create policy "Ledger inserted by owner" on public.ledger_entries
for insert with check (public.is_owner());

create policy "Adhoc receipts readable by staff" on public.adhoc_receipts
for select using (public.is_staff_or_owner());

create policy "Adhoc receipts inserted by staff" on public.adhoc_receipts
for insert with check (public.is_staff_or_owner());

create policy "Adhoc receipts updated by owner" on public.adhoc_receipts
for update using (public.is_owner());

create policy "Adhoc receipts deleted by owner" on public.adhoc_receipts
for delete using (public.is_owner());
