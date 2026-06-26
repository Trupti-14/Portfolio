# Trupti Patil — Portfolio

A professional, data-driven portfolio for showcasing my software engineering profile, projects, achievements, skills, certifications, and current work.
The portfolio includes a public recruiter-facing website and a private Supabase-powered admin panel to update content without redeploying every time.

## Live Portfolio

**Portfolio:** https://trupti-14.vercel.app
**Admin Panel:** https://trupti-14.vercel.app/admin.html

## About

I am **Trupti Patil**, a B.Tech Computer Engineering student at MKSSS’s Cummins College of Engineering for Women, Pune.

This portfolio highlights my work in:

* Software Engineering
* Backend Development
* Full Stack Development
* AI/ML
* Cybersecurity
* Java + DSA
* Hackathon Projects

## Features

### Public Portfolio

* Premium dark command-center UI
* Responsive one-page portfolio
* Hero section with engineering profile
* Currently Building section
* Daily rotating quote section
* Premium project case-study cards
* Skills/toolkit section
* Education section
* Achievements and proof gallery
* Certifications section
* Recruiter-focused contact section
* Conditional Resume, GitHub, LinkedIn, LeetCode, Codeforces, CodeChef, and HackerRank links

### Admin Panel

The private admin panel allows portfolio content to be updated without editing code manually.

Admin supports:

* Profile editing
* Resume upload
* Profile photo upload
* Contact details update
* Project add/edit/delete/hide
* Skills update
* Achievements update
* Certifications update
* Gallery image management
* Currently Building update
* Quote Library management
* Daily quote seeding
* Visitor analytics

Admin access is protected using:

* Supabase Auth
* Admin allowlist
* Row Level Security policies

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend / Database

* Supabase Auth
* Supabase Database
* Supabase Storage
* Supabase Row Level Security

### Deployment

* GitHub
* Vercel

## Project Structure

```text
Portfolio/
│
├── index.html
├── style.css
├── script.js
│
├── admin.html
├── admin.css
├── admin.js
│
├── portfolio-data.js
├── portfolio-service.js
├── analytics.js
├── default-quotes.js
│
├── supabase-client.js
├── supabase-config.js
├── supabase-config.example.js
│
├── assets/
│   ├── profile/
│   ├── projects/
│   ├── achievements/
│   ├── certificates/
│   └── gallery/
│
├── images/
│
├── supabase/
│   ├── schema.sql
│   └── quote-library-migration.sql
│
├── ADMIN_GUIDE.md
├── CONTENT_GUIDE.md
└── README.md
```

## Main Sections

### Hero

Introduces my engineering profile, core stack, and internship focus.

### Currently Building

Shows active work such as hackathons, prototypes, and DSA preparation.

### Projects

Projects are displayed as premium case studies.

Current highlighted projects:

1. **ShadowTrace**
   Cybersecurity threat-monitoring platform using Java, Spring Boot, React, and graph algorithms.

2. **Vanguard**
   Banking cybersecurity and compliance automation solution for Canara Bank Suraksha Hackathon 2.0.

3. **AyuCare**
   AI-assisted disease screening platform using Python, FastAPI, scikit-learn, and Keras.

4. **SwiftShare**
   Java-based group expense settlement system and 1st Prize winner at Buffer 6.0 FinTech Hackathon.

### Skills

Organized technical toolkit covering:

* Languages
* Backend
* Frontend
* Databases
* AI/ML
* Core Computer Science
* Tools

### Achievements

Includes hackathon achievements, coding contest results, and leadership activities.

### Contact

Recruiter-focused section with conditional links for:

* Email
* Resume
* GitHub
* LinkedIn
* LeetCode
* Codeforces
* CodeChef
* HackerRank

## Supabase Setup

This project uses Supabase for admin editing, storage, authentication, and analytics.

### Required Supabase Services

* Authentication
* Database
* Storage
* Row Level Security

### SQL Setup

Run the main schema file in Supabase SQL Editor:

```text
supabase/schema.sql
```

Then run the quote library migration:

```text
supabase/quote-library-migration.sql
```

### Admin User Setup

After creating a Supabase Auth user, add the user UUID to the `admin_users` table:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_UUID');
```

Only allowlisted users can access the admin dashboard.

## Supabase Config

Create a file named:

```text
supabase-config.js
```

Use this structure:

```js
window.SUPABASE_CONFIG = {
  url: "YOUR_SUPABASE_PROJECT_URL",
  anonKey: "YOUR_SUPABASE_PUBLISHABLE_KEY"
};
```

Important:

* Use only the publishable/anon key.
* Do not add the service role key.
* Do not expose database passwords.
* Security is handled through Supabase RLS policies.

## Run Locally

Open PowerShell or terminal:

```powershell
cd E:\Portfolio-main
python -m http.server 4173 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:4173
```

Admin panel:

```text
http://127.0.0.1:4173/admin.html
```

## Deployment

The portfolio is deployed on Vercel.

To update the live site:

```powershell
cd E:\Portfolio-deploy
git status
git add .
git commit -m "Update portfolio"
git push
```

Vercel redeploys from the connected GitHub repository.

## Updating Content

Most content can be updated from the admin panel without redeploying.

Admin panel:

```text
/admin.html
```

You can update:

* Contact details
* Resume link
* Profile photo
* Projects
* Skills
* Achievements
* Certifications
* Gallery
* Current work
* Quotes

Some code-level UI/design changes still require Git commit and redeployment.

## Quote Rotation

The portfolio includes a daily rotating quote system.

Behavior:

* Quote remains stable for the current day.
* Quote changes automatically the next day.
* Supabase visible quotes are used first.
* If Supabase quotes are unavailable, local default quotes are used.
* Admin can seed default quotes from the Quote Library.

## Visitor Analytics

The admin dashboard tracks anonymous visitor analytics.

Tracked data:

* Total visits
* Estimated unique visitors
* Today’s visits
* Last 7 days visits
* Device type
* Referrer
* Recent visits

Privacy:

* No names collected
* No emails collected
* No raw IP addresses stored
* No exact locations stored

## Security Notes

* Admin dashboard is protected by Supabase Auth and an admin allowlist.
* Row Level Security controls database access.
* Public users can only read visible portfolio content.
* Public users can insert anonymous analytics events.
* Only allowlisted admin users can edit portfolio content.
* Never commit Supabase service role keys.

## Future Improvements

Possible future upgrades:

* Add custom favicon
* Add project demo videos
* Add more project screenshots
* Add blog/notes section
* Add GitHub contribution highlights
* Add better mobile admin UX
* Add more analytics charts

## Author

**Trupti Patil**
B.Tech Computer Engineering
MKSSS’s Cummins College of Engineering for Women, Pune

* GitHub: https://github.com/Trupti-14
* LinkedIn: https://www.linkedin.com/in/trupti75
* Portfolio: https://trupti-14.vercel.app
