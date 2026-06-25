# Portfolio Content Guide

Most portfolio content now lives in `portfolio-data.js`. You normally do not need to edit repeated HTML cards.

After changing the data file, save it and refresh the browser. Keep commas between objects and array items.

## Folder structure

Place new images in these folders:

```text
assets/
  profile/
  achievements/
  certificates/
  gallery/
  projects/
```

The existing certificate images still live in `images/` and continue to work. New images should use the `assets/` folders.

Prefer `.webp` for new images because it is usually smaller. Existing `.png` and `.jpg` files are also supported.

## Update Currently Building

Find `currentlyBuilding` in `portfolio-data.js`.

```js
{
  id: "project-or-goal-id",
  title: "What I am working on",
  status: "In Progress",
  description: "A short description of the current work.",
  tags: ["Java", "Backend"],
  visible: true,
  order: 1
}
```

- Change `status` whenever the work moves to a new stage.
- Set `visible: false` when the item is paused, completed, or no longer current.
- Change `order` to rearrange the queue.
- Add a new item by copying one complete object and giving it a unique `id`.

## Update the motivation quote fallback

The private admin's Quote Library is the normal way to manage rotating quotes.
For an existing Supabase project, first run
`supabase/quote-library-migration.sql`.

The site ships with 20 default engineering and scientific-thinking quotes in
`default-quotes.js`. They rotate locally when Supabase is unavailable or has no
quote rows. In the admin, use **Seed default quotes** to copy only missing stable
IDs into Supabase; existing customizations are not overwritten.

`portfolio-data.js` still contains the offline fallback:

```js
quote: {
  visible: true,
  text: "Talk is cheap. Show me the code.",
  author: "Linus Torvalds",
  context: "A reminder to keep building real systems, not just ideas."
}
```

Set `visible: false` to hide the fallback section. Keep the quote short so it
remains subtle.

In the admin Quote Library:

- Use **Add item** to create a quote with a stable ID.
- Use **Hide** to remove it from rotation without deleting it.
- Use **Delete** to remove it permanently.
- Use **Display order** to control the rotation sequence.

The public site sorts visible quotes by display order and deterministically
chooses `dayNumber % visibleQuoteCount`. The selected quote remains unchanged
for the full local calendar day and advances automatically the next day. With
one visible quote, that quote is always shown. With no visible quotes after the
library contains managed rows, the quote section is hidden only when all of
those rows are hidden. Deleting every database quote restores the local default
bank.

## Project case-study rendering

All projects now use one consistent wide case-study layout. The `featured`
field remains supported, but it does not reduce non-featured projects to
smaller cards.

Each project should provide:

- A clear category in `label`
- A concise engineering-focused `description`
- A specific `contribution`
- Focused `tags`
- GitHub and live URLs only when they exist
- An optional screenshot and meaningful `imageAlt`

If `image` is empty or fails to load, the site renders a CSS system schematic.
The four main projects have tailored visual labels:

- ShadowTrace: threat graph
- Vanguard: compliance pipeline
- AyuCare: AI screening/model flow
- SwiftShare: settlement/transaction graph

Changing project content through the admin does not require redeployment.
Changing the card layout or schematic CSS does.

## Contact visibility

The admin **Contact** panel is the normal editing surface for:

- Availability label and status
- Headline and recruiter-facing body copy
- Role/technology chips and preferred roles
- Location and section visibility
- Email, portfolio, resume, social, and coding-profile routes

Contact links are URL-driven. Empty email, GitHub, LinkedIn, Resume, LeetCode,
Codeforces, CodeChef, or HackerRank links are omitted automatically. The
displayed email is derived from the editable admin email value and includes a
Copy email action.

The contact object is stored under `portfolio_meta.content.contact`; routes are
stored in `portfolio_links`, with coding-profile rows retained for backward
compatibility. Supabase values take priority, while `portfolio-data.js` supplies
the complete offline fallback.

External URLs must use `https://`. Resume accepts an HTTPS URL or a relative
path. Updating contact content and links through admin does not require a
redeploy. Editing the fallback object or contact CSS/JavaScript does.

## Admin upload limits

- Profile: JPG, PNG, or WebP up to 5 MB
- Project, achievement, certificate, and gallery images: JPG, PNG, or WebP up
  to 8 MB
- Resume: PDF up to 10 MB

An existing file is not uploaded again unless a new file is selected. Network,
timeout, RLS, and Storage errors are shown in the admin instead of leaving a
save button indefinitely busy.

## Add coding-profile links

Find `codingProfiles` and update the appropriate platform:

```js
{
  id: "codeforces",
  platform: "Codeforces",
  username: "your-handle",
  url: "https://codeforces.com/profile/your-handle",
  visible: true,
  order: 2
}
```

The same structure works for LeetCode, CodeChef, and HackerRank.

- Empty `url`: the profile is not displayed.
- Empty `username` with a valid URL: only the platform name is displayed.
- `visible: false`: temporarily hides a saved profile.
- `order`: controls its position.

Do not add a guessed or inactive profile URL.

## Add a project

Open `portfolio-data.js`, find `projects`, and add an object:

```js
{
  id: "my-project",
  title: "My Project",
  featured: false,
  visible: true,
  order: 5,
  label: "Backend",
  description: "A concise explanation of the problem and the system you built.",
  contribution: "The APIs, algorithms, models, or interface work you personally completed.",
  tags: ["Java", "Spring Boot", "MySQL"],
  github: "https://github.com/your-name/repository",
  live: "",
  image: "assets/projects/my-project.webp",
  imageAlt: "My Project dashboard showing ...",
  imageWidth: 1600,
  imageHeight: 900
}
```

- Leave `github`, `live`, or `image` empty when unavailable. No broken button or image will be shown.
- Set `featured: true` for visually emphasized projects.
- Use a unique, lowercase `id` with hyphens.

## Hide, delete, or reorder a project

- Hide temporarily: set `visible: false`.
- Show again: set `visible: true`.
- Delete permanently: remove the full project object, including its surrounding braces and nearby comma.
- Reorder: change `order`. Smaller numbers appear first.

The displayed project numbers are generated automatically.

## Add an achievement

Find `achievements` and add:

```js
{
  id: "new-achievement",
  group: "technical",
  rank: "1st Prize",
  title: "Competition Name",
  description: "What you achieved, what you built, and the scale of the competition.",
  primary: true,
  image: "",
  imageAlt: "Team receiving the award at Competition Name",
  imageFit: "cover",
  proofImages: [],
  visible: true,
  order: 6
}
```

Use `group: "technical"` for technical achievements and `group: "leadership"` for activities. The available groups are defined in `achievementGroups`.

As with projects:

- `visible: false` hides the achievement.
- `order` controls its position inside the group.
- `primary: true` gives it a slightly stronger border.

## Add an achievement photo

Place the file in `assets/achievements/`, then update:

```js
image: "assets/achievements/buffer-6-team.webp",
imageAlt: "SwiftShare team at Buffer 6.0 FinTech Hackathon",
imageFit: "cover",
```

Use:

- `imageFit: "cover"` for team, stage, or event photos.
- `imageFit: "contain"` for certificates or screenshots that must remain fully visible.

Leave `image: ""` when no photo is available. The text card will remain polished.

## Add multiple proof images

Use `proofImages` inside an achievement:

```js
proofImages: [
  {
    src: "assets/achievements/buffer-6-certificate.webp",
    alt: "Buffer 6.0 first-prize certificate",
    fit: "contain",
    width: 1600,
    height: 1200
  },
  {
    src: "assets/achievements/buffer-6-team.webp",
    alt: "SwiftShare team at Buffer 6.0",
    fit: "cover",
    width: 1600,
    height: 1200
  }
]
```

Proof images appear in a small expandable gallery. Failed or missing images remove themselves without showing a broken-image icon.

## Add a gallery photo

Place the image in `assets/gallery/`, then add an item to `gallery`:

```js
{
  id: "buffer-6-win",
  title: "Buffer 6.0 FinTech Hackathon",
  caption: "1st Prize in the FinTech domain for SwiftShare.",
  src: "assets/gallery/buffer-6-win.webp",
  alt: "Trupti Patil at the Buffer 6.0 hackathon",
  type: "achievement",
  fit: "cover",
  imageWidth: 1200,
  imageHeight: 800,
  visible: true,
  order: 1
}
```

- Use `fit: "cover"` for event, team, stage, or hackathon photos.
- Use `fit: "contain"` for certificates and documents.
- Use `visible: false` to hide an entry without deleting it.
- Use `order` to control its position.

If `src` is empty or the file cannot load, the item removes itself without showing a broken-image icon. Keep the gallery curated; a few strong proof images are better than a large photo album.

From the admin, Gallery **Delete** removes the database row and then attempts to
remove its uploaded Supabase Storage object. Local paths and external image URLs
are left untouched. If the database row is deleted but Storage cleanup fails,
the admin reports that clearly; check the console and remove the orphaned file
from the `gallery` bucket manually.

## Add or update a certification

Find `certifications`. Each item supports:

```js
{
  id: "course-id",
  type: "Course",
  title: "Course Name",
  description: "What you learned.",
  tags: ["Topic One", "Topic Two"],
  image: "assets/certificates/course-certificate.webp",
  imageAlt: "Course Name completion certificate",
  imageWidth: 1600,
  imageHeight: 1100,
  visible: true,
  order: 5
}
```

Certificate images automatically use `object-fit: contain`, so the full certificate remains visible.

Set `visible: false` to hide one. Leave `image` empty to display a text-only certification card.

## Update skills

Find `skills`. Edit `items`, change `order`, or use `visible: false`.

```js
{
  id: "cloud",
  title: "Cloud",
  items: ["AWS"],
  visible: true,
  order: 8,
  wide: false
}
```

Set `wide: true` when a group contains many items.

## Update education

Edit the `education` object. You can update:

- graduation year in `period`
- degree
- institution
- CGPA and location in `facts`
- About/Education paragraphs

Set `education.visible` to `false` to hide the complete section.

## Update the profile photo

1. Add a square or portrait image to `assets/profile/`.
2. Prefer a professional, well-lit image.
3. Update:

```js
profile: {
  photo: "assets/profile/trupti-profile.webp",
  fallbackInitials: "TP",
  alt: "Trupti Patil profile photo"
}
```

If `photo` is empty or the file cannot load, the initials are shown automatically. The image uses `object-fit: cover` and will not be distorted.

## Update Resume, GitHub, LinkedIn, or email

Find `links`:

```js
links: {
  resume: "resume.pdf",
  email: "mailto:your-email@example.com",
  github: "https://github.com/your-name",
  linkedin: "https://www.linkedin.com/in/your-name/",
  leetcode: "https://leetcode.com/u/your-name/"
}
```

- Put `resume.pdf` in the repository root, or change the path.
- Leave a link empty to hide its buttons everywhere.
- Do not add placeholder or guessed profile links.

The separate Coding Profiles section is controlled through `codingProfiles`.

## Recommended image sizes

- Profile photo: approximately 600 × 600 px or larger, square crop.
- Project preview: 1600 × 900 px, 16:9.
- Gallery/event photo: approximately 1200 × 800 px.
- Achievement/event photo: approximately 1200 × 800 px.
- Certificate: approximately 1200 px wide or larger, original aspect ratio.
- Aim for less than 300 KB per image when practical.
- Use `.webp` at roughly 75–85% quality for photos.

Avoid uploading many large images. Only the profile image is above the fold; other portfolio images load lazily.

## Privacy reminder

Before uploading certificates or event documents:

- Crop or blur phone numbers, email addresses, home addresses, student IDs, certificate IDs, QR codes, signatures, registration numbers, and other sensitive details.
- Check the image at full size, not only as a small card.
- Do not upload documents you do not have permission to publish.

Use descriptive alt text, but do not put sensitive personal information in alt text or filenames.
