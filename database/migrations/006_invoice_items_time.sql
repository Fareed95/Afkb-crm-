-- 006_invoice_items_time.sql
ALTER TABLE public.invoice_items ADD COLUMN work_timestamp timestamptz;
