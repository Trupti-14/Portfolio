-- Quote Library migration for an existing portfolio Supabase project.
-- Safe to run more than once.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

alter table public.quotes enable row level security;

drop trigger if exists set_quotes_updated_at on public.quotes;
create trigger set_quotes_updated_at
before update on public.quotes
for each row execute function public.set_updated_at();

drop policy if exists "Public can read visible quote library" on public.quotes;
create policy "Public can read visible quote library"
on public.quotes for select
to anon, authenticated
using (visible = true or public.is_portfolio_admin());

drop policy if exists "Admin can insert quotes" on public.quotes;
create policy "Admin can insert quotes"
on public.quotes for insert
to authenticated
with check (public.is_portfolio_admin());

drop policy if exists "Admin can update quotes" on public.quotes;
create policy "Admin can update quotes"
on public.quotes for update
to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

drop policy if exists "Admin can delete quotes" on public.quotes;
create policy "Admin can delete quotes"
on public.quotes for delete
to authenticated
using (public.is_portfolio_admin());

-- Preserve the existing singleton quote as the first library item.
insert into public.quotes (
  id,
  quote_text,
  author,
  context,
  visible,
  display_order
)
select
  'legacy-build-principle',
  quote_text,
  author,
  context,
  visible,
  1
from public.portfolio_quote
where id = 'main'
  and quote_text <> ''
on conflict (id) do nothing;

-- Mark the library as authoritative. With this marker, hiding every quote
-- hides the public quote section instead of restoring the legacy fallback.
insert into public.portfolio_meta (id, content)
select
  'main',
  jsonb_build_object(
    'quote_library_initialized',
    true,
    'quote_library_has_entries',
    exists (select 1 from public.quotes)
  )
on conflict (id) do update
set content = coalesce(public.portfolio_meta.content, '{}'::jsonb)
  || excluded.content;

-- Repair/confirm gallery policies used by the verified admin delete flow.
drop policy if exists "Public can read visible gallery" on public.gallery;
create policy "Public can read visible gallery"
on public.gallery for select
to anon, authenticated
using (visible = true or public.is_portfolio_admin());

drop policy if exists "Admin can delete gallery" on public.gallery;
create policy "Admin can delete gallery"
on public.gallery for delete
to authenticated
using (public.is_portfolio_admin());

drop policy if exists "Admin can delete portfolio files" on storage.objects;
create policy "Admin can delete portfolio files"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('resumes', 'profile', 'projects', 'achievements', 'certificates', 'gallery')
  and public.is_portfolio_admin()
);
