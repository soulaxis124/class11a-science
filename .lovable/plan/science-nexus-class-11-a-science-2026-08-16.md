# Science Nexus — Class 11-A Science

A premium, multi-route 3D digital universe for Class 11-A Science, created by Asadullah. Built with real 3D (React Three Fiber), placeholder-driven data, and an architecture where you can drop in real names, roll numbers, photos, house colors and events later without any redesign.

## Visual identity

- Dark cinematic base: deep navy / near-black, scientific cyan-blue primary, soft white text, restrained green environmental accent, plus four configurable house accent tokens (neutral defaults until you give real colors).
- Premium glassmorphism panels, soft depth shadows, thin luminous borders, no heavy neon, no gaming feel.
- Typography: a technical geometric display face for headings + a clean humanist body face, loaded via `<link>` in the root route.
- Science woven into the visual language, not as icon decoration: faint coordinate grids, molecular link patterns, orbital rings, DNA helix line art, equation glyph textures used as subtle background layers.

## Structure

Every section is its own route with its own metadata:

```text
/                 cinematic 3D hero + ENTER THE CLASS UNIVERSE
/class            our class overview + animated statistics
/teacher          Rachna Ma'am profile (placeholders only)
/students         33-student directory + search/filter/sort + 3D constellation
/students/$roll   individual student profile
/houses           four house towers + championship leaderboard
/houses/chanakya | valmiki | patanjali | dronacharya
/green-cabinet    12 members, living green 3D environment
/monitors         Ibrahim (Boys Monitor), Tanishka (Girls Monitor)
/achievements     hall of fame display cases
/events           class events
/timeline         time tunnel
/gallery          memory museum with fullscreen viewer
/projects         project gallery
/science-lab      Physics / Chemistry / Biology / Mathematics zones
/calendar         interactive calendar
/yearbook         digital yearbook vault
/about            created by Asadullah
```

Shared chrome lives in the root route: floating glass navigation (animated drawer on mobile), persistent ambient background canvas, and a light fade/scale route transition so navigation feels like moving inside one world.

## 3D approach

- One shared, low-cost ambient particle/grid canvas behind all pages.
- Heavier scenes (hero, campus hub, house towers, student constellation, green world) are lazy-loaded per route and client-only, each with a styled static fallback.
- Campus hub on `/` after entering: clickable 3D location markers that route to the twelve destinations — 3D is navigation, not decoration.
- Student constellation: 33 glowing nodes, hover tooltip (name, roll, house), click routes to the profile. Automatic downgrade to a 2D grid on mobile or low-performance devices.
- Reduced-motion and low-power paths respected throughout.

## Data architecture

All content in `src/data/` as typed modules, UI reads only from there:

- `class.ts`, `teacher.ts` (Rachna Ma'am, all fields placeholder)
- `students.ts` — exactly 33 records, roll 1–33, `name: null` placeholders except Roll 11 Asadullah; every record has a `photo` field pointing at a shared elegant placeholder
- `houses.ts` — Chanakya, Valmiki, Patanjali, Dronacharya, with `color` tokens you can swap in one place; points default 0
- `greenCabinet.ts` — exactly 12 slots, three filled (Asadullah, Mishti, Mobinaa)
- `monitors.ts`, `achievements.ts`, `events.ts`, `timeline.ts`, `gallery.ts`, `projects.ts`, `calendar.ts`, `yearbook.ts`, `scienceLab.ts`

Nothing is invented: unknown names, photos, dates and stats render as clearly styled "Coming soon" placeholders.

## Reusable components

`StudentCard`, `HouseCard`, `AchievementCard`, `GalleryGrid`, `TimelineTrack`, `StatCounter`, `GlassPanel`, `SectionHero`, `PlaceholderBadge`, `Modal`, `Scene3D` wrapper. No page duplicates layout logic.

## Build order

1. Design tokens, typography, global nav, root layout, ambient canvas
2. Data models with all 33 / 12 records
3. Landing hero + campus hub + all route shells
4. Class, Teacher, Students (directory, filters, constellation, profiles)
5. Houses + championship, Green Cabinet, Leadership
6. Achievements, Timeline, Gallery, Projects, Events
7. Science Lab, Calendar, Yearbook, About
8. Responsive, performance and accessibility pass

## Notes

- No backend now; data files are structured so an admin/CMS layer can replace them later.
- No sensitive personal data anywhere in the models.
- House colors, all photos and all text content are single-point editable.
