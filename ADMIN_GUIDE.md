# Portfolio Admin and Analytics Guide

The public portfolio remains a static site. Supabase adds authenticated editing,
file storage, and anonymous visit analytics without exposing an admin password or
service-role key in the browser.

## 1. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com/).
2. Open **SQL Editor** in the project dashboard.
3. Run the complete [`supabase/schema.sql`](supabase/schema.sql) file.

The SQL creates the content tables, analytics table, storage buckets, helper
functions, indexes, update triggers, and Row Level Security policies.

## 2. Create and allowlist the admin account

1. In Supabase, open **Authentication → Users**.
2. Create one email/password user for portfolio administration.
3. Copy that user's UUID.
4. Run this in SQL Editor, replacing the placeholder:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID');
```

Authentication alone is not enough to edit the portfolio. The UUID must also
exist in `public.admin_users`.

For a private single-admin portfolio, disable public user sign-ups in
**Authentication → Providers → Email** after creating the account.

## 3. Configure the browser client

Copy the values from **Project Settings → API** into `supabase-config.js`:

```js
window.SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_KEY"
};
```

The anon key is intended for browser use and is restricted by the included RLS
policies. Never place a `service_role` key, database password, or admin password
in this repository.

If the URL or anon key is empty, the public site uses `portfolio-data.js` and the
admin login is disabled with a setup message.

## 4. Run locally

Serve the directory over HTTP rather than opening the HTML as a raw file:

```powershell
cd E:\Portfolio-main
python -m http.server 4173 --bind 127.0.0.1
```

Open:

- Public portfolio: `http://127.0.0.1:4173/index.html`
- Private admin: `http://127.0.0.1:4173/admin.html`

## 5. First admin save

On a new database, the editor initially shows the existing
`portfolio-data.js` content. The first successful save, hide/show, or delete
operation imports that content into Supabase and marks the database as
initialized. From then on, Supabase is authoritative, including when a section
has zero visible items.

This prevents hidden content from being accidentally restored by the local
fallback. If Supabase is unavailable, the public site still loads the local
fallback normally.

## 6. Updating content

Sign in at `admin.html`. The dashboard supports:

- Profile, headline, bio, CGPA, graduation year, photo, and resume
- Recruiter contact copy, role chips, availability, and contact routes
- Currently-building items
- Projects and project screenshots
- Achievements and multiple proof images
- Skill categories
- Certifications and certificate images
- Daily rotating Quote Library
- Curated gallery items
- Visibility controls, numeric ordering, editing, and deletion

IDs are stable database keys. Existing IDs cannot be renamed in the editor;
create a new item and delete the old one when a key truly needs to change.

When an allowlisted admin session is active, the public portfolio reveals a
small **Control** link in its navigation. Logged-out visitors and authenticated
non-admin users never see it. `Ctrl + Shift + A` opens `admin.html` as a
convenience shortcut, but it does not bypass login or the admin allowlist.

Uploaded resume files must be PDFs. Images must be JPEG, PNG, or WebP. The
database stores the resulting public Storage URL. Empty image fields are safely
omitted by the public renderer.

### Quote Library migration and rotation

For an existing Supabase project, run
[`supabase/quote-library-migration.sql`](supabase/quote-library-migration.sql)
once in the Supabase SQL Editor. It creates the `quotes` table and RLS policies,
copies the legacy singleton quote when available, and marks the library as
initialized.

The admin Quote Library can add, edit, hide/show, reorder, and delete quotes.
It also includes **Seed default quotes**, which inserts the built-in engineering
quote bank by stable ID. Existing rows are never overwritten and repeated
seeding does not create duplicates.

The built-in bank contains 20 concise, commonly attributed quotes about
software design, systems, scientific thinking, learning, and building. It is
stored in `default-quotes.js` and provides useful daily rotation immediately,
even when Supabase is unavailable or the `quotes` table has no rows.

The public page sorts visible quotes by `display_order`, converts the visitor's
current local calendar date to a day number, and selects:

```text
dayNumber % visibleQuoteCount
```

The result stays stable for the entire local calendar day and advances
automatically without a cron job or redeploy. Supabase visible quotes take
priority. An empty or unavailable Supabase quote library uses the local default
bank. If database quotes exist but every one is hidden, the quote section is
hidden intentionally.

### Project case studies

Every visible project uses the same premium case-study structure: numbered
rail, category, title, description, contribution, stack, links, and visual
area. `featured` can still be used as metadata/emphasis, but non-featured
projects no longer receive a smaller card.

When no screenshot is available—or an image fails to load—the public renderer
uses a CSS schematic. ShadowTrace, Vanguard, AyuCare, and SwiftShare have
project-specific threat-graph, compliance, AI-screening, and settlement-flow
labels.

### Contact editor

The admin **Contact** panel edits both `portfolio_meta.content.contact` and
`portfolio_links`. It controls:

- Availability label, status, headline, body, chips, preferred roles, location,
  and section visibility
- Email, portfolio, resume, GitHub, LinkedIn, LeetCode, Codeforces, CodeChef,
  and HackerRank routes
- Coding-profile usernames

The save updates only the contact metadata, links singleton, and coding-profile
rows. It does not republish project, skill, achievement, or gallery collections.

Email display text is derived from the saved `mailto:` link, so changing the
admin email updates the recruiter-facing address without hardcoded duplicate
content. The public Email card also includes a Copy button.

All public routes are conditional. Empty links are omitted automatically. A
missing local resume is checked before rendering so visitors do not receive a
broken download. Resume links open in a new tab; external profile links use
`noopener noreferrer`.

Contact validation requires a normal email address and `https://` for external
URLs. A resume may use either an `https://` URL or a safe relative path such as
`resume.pdf`.

### Save and upload reliability

Admin authentication, reads, writes, deletes, analytics, and uploads use
timeouts. A stalled network or blocked RLS operation now returns a readable
message and resets the affected button.

Upload validation:

- Profile image: JPEG, PNG, or WebP; maximum 5 MB
- Project, achievement, certificate, and gallery images: JPEG, PNG, or WebP;
  maximum 8 MB
- Resume: PDF only; maximum 10 MB

Files are uploaded only when a new file is selected. Saving text does not
re-upload the existing asset. After a successful save, the changed singleton or
collection is re-read from Supabase instead of trusting stale local state.

### Gallery deletion

Gallery deletion first verifies that Supabase returned the deleted row ID. This
catches missing IDs and RLS policies that silently delete zero rows. The admin
list refreshes immediately after the database deletion is confirmed.

For images uploaded to the `gallery` bucket, the admin then attempts to remove
the corresponding Storage object. External URLs and local fallback paths are
ignored safely. If Storage cleanup fails, the database row remains deleted and
the admin shows a warning. Check the browser console and Supabase Storage
policies, then remove the orphaned file manually if necessary.

## 7. Visitor analytics

The public page records lightweight events in `site_visits`:

- Anonymous visitor ID generated in the browser and stored in `localStorage`
- Page or section path
- Referrer hostname, when the browser supplies one
- Broad device class: mobile, tablet, or desktop
- Event timestamp

It does not collect names, email addresses, phone numbers, raw IP addresses,
precise locations, or user-agent strings. Unique visitors are estimates because
visitors can clear browser storage or use multiple browsers.

Public visitors may insert valid analytics events but cannot read them. Only an
allowlisted authenticated admin can read the analytics dashboard.

## 8. Storage buckets

The schema creates these public-read, admin-write buckets:

- `resumes`
- `profile`
- `projects`
- `achievements`
- `certificates`
- `gallery`

Do not make bucket write policies public. The included policies require the
authenticated user to pass `is_portfolio_admin()`.

## 9. Deploy

Deploy the repository as a normal static site to GitHub Pages, Netlify, Vercel,
Cloudflare Pages, or a similar host. Ensure these files are included:

- `index.html`, `admin.html`
- Public and admin CSS/JavaScript files
- `portfolio-data.js`
- `default-quotes.js`
- `supabase-config.js`
- `resume.pdf` and local image assets

Use HTTPS in production. Add the production site URL to Supabase's allowed
redirect/site URLs under **Authentication → URL Configuration**.

The admin page is intentionally absent from the public navigation and has
`noindex, nofollow`, but its URL is not a security boundary. Authentication,
the admin allowlist, and RLS provide the actual protection.

## 10. Changes that still require redeployment

Admin content and Storage uploads do not require a site redeploy. Redeploy for:

- HTML structure, CSS, JavaScript, or accessibility changes
- Database schema or RLS changes after editing the SQL
- Changes to the local fallback in `portfolio-data.js`
- A changed Supabase project URL or anon key
- New static files that are not uploaded through the admin
- Changes to the built-in quote bank in `default-quotes.js`
- Project card structure, contact copy, or other public rendering code

## Troubleshooting

- **Signed in but denied:** verify the Auth user's exact UUID is in
  `public.admin_users`.
- **Tables or buckets missing:** rerun `supabase/schema.sql` in SQL Editor.
- **Quote Library unavailable:** run
  `supabase/quote-library-migration.sql`, then reload the admin.
- **Upload rejected:** verify file type/size and the Storage policies.
- **Gallery row deleted but file remains:** verify Storage delete RLS, then
  remove the orphaned object from the `gallery` bucket manually.
- **Public site shows fallback:** confirm configuration, browser network access,
  and that the first admin operation completed successfully.
- **No analytics yet:** visit the public page in a fresh session, then refresh
  the admin analytics panel.
