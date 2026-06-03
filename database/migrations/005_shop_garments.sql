-- 005_shop_garments.sql
ALTER TABLE public.garments ADD COLUMN shop_id uuid REFERENCES public.shops(id) ON DELETE CASCADE;
