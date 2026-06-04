-- Role checks must bypass profiles RLS. Otherwise the profiles SELECT policy
-- calls is_owner(), which queries profiles and recursively evaluates the policy.

create or replace function public.get_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where user_id = (select auth.uid());
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.get_user_role() = 'owner';
$$;

create or replace function public.is_staff_or_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.get_user_role() in ('owner', 'staff');
$$;
