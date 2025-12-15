-- Supabase schema for Strategy Intelligence Platform
-- Tables: startups / insights / hubs
-- Notes:
-- - RLS is enabled: anon key can READ only.
-- - Use service role key (local script) for seeding/writes.

create extension if not exists pgcrypto;

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- startups
-- ------------------------------------------------------------
create table if not exists public.startups (
  id uuid primary key default gen_random_uuid(),
  date date,
  company text not null,
  sector text,
  founders_background text,
  the_moat text,
  business_model text,
  funding_status text,
  key_risks text,
  verdict text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint startups_company_unique unique(company)
);

drop trigger if exists set_updated_at_startups on public.startups;
create trigger set_updated_at_startups
before update on public.startups
for each row execute function public.set_updated_at();

alter table public.startups enable row level security;

drop policy if exists "public read startups" on public.startups;
create policy "public read startups"
on public.startups
for select
to anon
using (true);

-- ------------------------------------------------------------
-- insights
-- ------------------------------------------------------------
create table if not exists public.insights (
  id text primary key,
  date date,
  kicker text,
  title text not null,
  subtitle text,
  tags text[] not null default '{}',
  hero_image_url text,
  support_image_url text,
  takeaways jsonb not null default '[]'::jsonb,
  sections jsonb not null default '[]'::jsonb,
  signals jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at_insights on public.insights;
create trigger set_updated_at_insights
before update on public.insights
for each row execute function public.set_updated_at();

alter table public.insights enable row level security;

drop policy if exists "public read insights" on public.insights;
create policy "public read insights"
on public.insights
for select
to anon
using (true);

-- ------------------------------------------------------------
-- hubs
-- ------------------------------------------------------------
create table if not exists public.hubs (
  id text primary key,
  city text not null,
  region text,
  lat double precision not null,
  lng double precision not null,
  pin jsonb,
  themes jsonb not null default '[]'::jsonb,
  signals jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at_hubs on public.hubs;
create trigger set_updated_at_hubs
before update on public.hubs
for each row execute function public.set_updated_at();

alter table public.hubs enable row level security;

drop policy if exists "public read hubs" on public.hubs;
create policy "public read hubs"
on public.hubs
for select
to anon
using (true);
