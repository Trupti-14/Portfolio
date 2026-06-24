-- Trupti Patil portfolio: Supabase schema, RLS, analytics, and storage policies.
-- Run this file in the Supabase SQL Editor after creating the project.
-- Then create an Auth user and add its UUID to public.admin_users.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

drop policy if exists "Admin can view own allowlist record" on public.admin_users;
create policy "Admin can view own allowlist record"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

create table if not exists public.portfolio_meta (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_links (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_quote (
  id text primary key default 'main',
  quote_text text not null default '',
  author text not null default '',
  context text not null default '',
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id text primary key,
  quote_text text not null,
  author text not null default '',
  context text not null default '',
  visible boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.currently_building (
  id text primary key,
  title text not null,
  status text not null default '',
  description text not null default '',
  tags text[] not null default '{}',
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key,
  title text not null,
  label text not null default '',
  description text not null default '',
  contribution text not null default '',
  tags text[] not null default '{}',
  github text not null default '',
  live text not null default '',
  image text not null default '',
  image_alt text not null default '',
  image_width integer,
  image_height integer,
  featured boolean not null default false,
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id text primary key,
  group_key text not null default 'technical',
  rank text not null default '',
  title text not null,
  category text not null default '',
  description text not null default '',
  primary boolean not null default false,
  image text not null default '',
  image_alt text not null default '',
  image_fit text not null default 'cover' check (image_fit in ('cover', 'contain')),
  proof_images jsonb not null default '[]'::jsonb,
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id text primary key,
  category text not null,
  skills text[] not null default '{}',
  wide boolean not null default false,
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id text primary key,
  title text not null,
  issuer text not null default '',
  type text not null default '',
  description text not null default '',
  tags text[] not null default '{}',
  image text not null default '',
  image_alt text not null default '',
  image_width integer,
  image_height integer,
  link text not null default '',
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id text primary key,
  title text not null,
  caption text not null default '',
  src text not null default '',
  alt text not null default '',
  type text not null default 'achievement'
    check (type in ('achievement', 'certificate', 'event', 'project')),
  fit text not null default 'cover' check (fit in ('cover', 'contain')),
  image_width integer,
  image_height integer,
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.coding_profiles (
  id text primary key,
  platform text not null,
  username text not null default '',
  url text not null default '',
  visible boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_visits (
  id bigint generated by default as identity primary key,
  visitor_id text not null check (char_length(visitor_id) between 8 and 100),
  event_type text not null default 'pageview'
    check (event_type in ('pageview', 'section_view')),
  page_path text not null default '/',
  referrer text not null default '',
  device_type text not null default 'desktop'
    check (device_type in ('mobile', 'tablet', 'desktop')),
  user_agent_optional text,
  created_at timestamptz not null default now()
);

create index if not exists site_visits_created_at_idx
on public.site_visits (created_at desc);

create index if not exists site_visits_event_type_idx
on public.site_visits (event_type, created_at desc);

create index if not exists site_visits_visitor_id_idx
on public.site_visits (visitor_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'portfolio_meta',
    'portfolio_links',
    'portfolio_quote',
    'quotes',
    'currently_building',
    'projects',
    'achievements',
    'skills',
    'certifications',
    'gallery',
    'coding_profiles'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger set_%I_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end $$;

alter table public.portfolio_meta enable row level security;
alter table public.portfolio_links enable row level security;
alter table public.portfolio_quote enable row level security;
alter table public.quotes enable row level security;
alter table public.currently_building enable row level security;
alter table public.projects enable row level security;
alter table public.achievements enable row level security;
alter table public.skills enable row level security;
alter table public.certifications enable row level security;
alter table public.gallery enable row level security;
alter table public.coding_profiles enable row level security;
alter table public.site_visits enable row level security;

-- Public singleton settings contain only portfolio-safe content.
drop policy if exists "Public can read portfolio meta" on public.portfolio_meta;
create policy "Public can read portfolio meta"
on public.portfolio_meta for select to anon, authenticated
using (true);

drop policy if exists "Public can read portfolio links" on public.portfolio_links;
create policy "Public can read portfolio links"
on public.portfolio_links for select to anon, authenticated
using (true);

drop policy if exists "Public can read visible quote" on public.portfolio_quote;
create policy "Public can read visible quote"
on public.portfolio_quote for select to anon, authenticated
using (visible = true or public.is_portfolio_admin());

drop policy if exists "Public can read visible quote library" on public.quotes;
create policy "Public can read visible quote library"
on public.quotes for select to anon, authenticated
using (visible = true or public.is_portfolio_admin());

-- Public users can read only visible collection rows.
drop policy if exists "Public can read visible current work" on public.currently_building;
create policy "Public can read visible current work"
on public.currently_building for select to anon, authenticated
using (visible = true or public.is_portfolio_admin());

drop policy if exists "Public can read visible projects" on public.projects;
create policy "Public can read visible projects"
on public.projects for select to anon, authenticated
using (visible = true or public.is_portfolio_admin());

drop policy if exists "Public can read visible achievements" on public.achievements;
create policy "Public can read visible achievements"
on public.achievements for select to anon, authenticated
using (visible = true or public.is_portfolio_admin());

drop policy if exists "Public can read visible skills" on public.skills;
create policy "Public can read visible skills"
on public.skills for select to anon, authenticated
using (visible = true or public.is_portfolio_admin());

drop policy if exists "Public can read visible certifications" on public.certifications;
create policy "Public can read visible certifications"
on public.certifications for select to anon, authenticated
using (visible = true or public.is_portfolio_admin());

drop policy if exists "Public can read visible gallery" on public.gallery;
create policy "Public can read visible gallery"
on public.gallery for select to anon, authenticated
using (visible = true or public.is_portfolio_admin());

drop policy if exists "Public can read visible coding profiles" on public.coding_profiles;
create policy "Public can read visible coding profiles"
on public.coding_profiles for select to anon, authenticated
using ((visible = true and url <> '') or public.is_portfolio_admin());

-- The allowlisted admin can write every portfolio table.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'portfolio_meta',
    'portfolio_links',
    'portfolio_quote',
    'quotes',
    'currently_building',
    'projects',
    'achievements',
    'skills',
    'certifications',
    'gallery',
    'coding_profiles'
  ]
  loop
    execute format('drop policy if exists "Admin can insert %s" on public.%I', table_name, table_name);
    execute format(
      'create policy "Admin can insert %s" on public.%I
       for insert to authenticated with check (public.is_portfolio_admin())',
      table_name,
      table_name
    );
    execute format('drop policy if exists "Admin can update %s" on public.%I', table_name, table_name);
    execute format(
      'create policy "Admin can update %s" on public.%I
       for update to authenticated
       using (public.is_portfolio_admin())
       with check (public.is_portfolio_admin())',
      table_name,
      table_name
    );
    execute format('drop policy if exists "Admin can delete %s" on public.%I', table_name, table_name);
    execute format(
      'create policy "Admin can delete %s" on public.%I
       for delete to authenticated using (public.is_portfolio_admin())',
      table_name,
      table_name
    );
  end loop;
end $$;

-- Anonymous visitors may insert analytics events, but can never read them.
drop policy if exists "Public can insert anonymous visits" on public.site_visits;
create policy "Public can insert anonymous visits"
on public.site_visits for insert
to anon, authenticated
with check (
  event_type in ('pageview', 'section_view')
  and device_type in ('mobile', 'tablet', 'desktop')
  and char_length(visitor_id) between 8 and 100
  and char_length(page_path) <= 250
  and char_length(referrer) <= 250
  and user_agent_optional is null
);

drop policy if exists "Admin can read analytics" on public.site_visits;
create policy "Admin can read analytics"
on public.site_visits for select
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "Admin can delete analytics" on public.site_visits;
create policy "Admin can delete analytics"
on public.site_visits for delete
to authenticated
using (public.is_portfolio_admin());

create or replace function public.get_visit_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_portfolio_admin() then
    raise exception 'Not authorized';
  end if;

  select jsonb_build_object(
    'total_visits', (
      select count(*) from public.site_visits where event_type = 'pageview'
    ),
    'unique_visitors', (
      select count(distinct visitor_id) from public.site_visits where event_type = 'pageview'
    ),
    'today_visits', (
      select count(*) from public.site_visits
      where event_type = 'pageview'
        and created_at >= date_trunc('day', now())
    ),
    'last_7_days', (
      select count(*) from public.site_visits
      where event_type = 'pageview'
        and created_at >= now() - interval '7 days'
    ),
    'top_page', coalesce((
      select page_path
      from public.site_visits
      where event_type = 'pageview'
      group by page_path
      order by count(*) desc
      limit 1
    ), ''),
    'top_section', coalesce((
      select page_path
      from public.site_visits
      where event_type = 'section_view'
      group by page_path
      order by count(*) desc
      limit 1
    ), ''),
    'device_breakdown', coalesce((
      select jsonb_object_agg(device_type, total)
      from (
        select device_type, count(*) as total
        from public.site_visits
        where event_type = 'pageview'
        group by device_type
      ) devices
    ), '{}'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.get_visit_summary() from public;
grant execute on function public.get_visit_summary() to authenticated;

-- Public storage buckets. Upload/update/delete access is still protected by RLS.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('resumes', 'resumes', true, 10485760, array['application/pdf']),
  ('profile', 'profile', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('projects', 'projects', true, 8388608, array['image/jpeg', 'image/png', 'image/webp']),
  ('achievements', 'achievements', true, 8388608, array['image/jpeg', 'image/png', 'image/webp']),
  ('certificates', 'certificates', true, 8388608, array['image/jpeg', 'image/png', 'image/webp']),
  ('gallery', 'gallery', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio storage" on storage.objects;
create policy "Public can view portfolio storage"
on storage.objects for select
to anon, authenticated
using (
  bucket_id in ('resumes', 'profile', 'projects', 'achievements', 'certificates', 'gallery')
);

drop policy if exists "Admin can upload portfolio files" on storage.objects;
create policy "Admin can upload portfolio files"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('resumes', 'profile', 'projects', 'achievements', 'certificates', 'gallery')
  and public.is_portfolio_admin()
);

drop policy if exists "Admin can update portfolio files" on storage.objects;
create policy "Admin can update portfolio files"
on storage.objects for update
to authenticated
using (public.is_portfolio_admin())
with check (
  bucket_id in ('resumes', 'profile', 'projects', 'achievements', 'certificates', 'gallery')
  and public.is_portfolio_admin()
);

drop policy if exists "Admin can delete portfolio files" on storage.objects;
create policy "Admin can delete portfolio files"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('resumes', 'profile', 'projects', 'achievements', 'certificates', 'gallery')
  and public.is_portfolio_admin()
);

-- After creating the admin user in Authentication > Users, run:
-- insert into public.admin_users (user_id) values ('YOUR_AUTH_USER_UUID');
