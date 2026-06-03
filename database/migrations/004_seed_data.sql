-- 004_seed_data.sql

insert into public.garments (garment_name, default_rate)
values
  ('Shirt', 12),
  ('Pant', 13),
  ('T-Shirt', 10),
  ('Kurta', 18),
  ('Pajama', 15),
  ('Coat', 40),
  ('Blazer', 45),
  ('Jacket', 35),
  ('Saree', 25),
  ('Ladies Suit', 30),
  ('Alteration', 8),
  ('Others', 0)
on conflict do nothing;
