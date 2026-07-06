# Yousuf Al Rawahi — Portfolio

A fast, data-driven personal portfolio built with **pure HTML, CSS, and JavaScript** — no framework, no build step. Live at **[asadalbadi.dev](https://asadalbadi.dev)**.

Design language: **"The Forge console"** — a terminal/console-native dark theme (cool-ink ground, single mint-cyan accent, monospace system chrome) that presents the engineer as a system.

## Features

- 🖥️ **Terminal-native UI** — status console, typed hero, monospace section labels, subtle dotted-grid background.
- 🧩 **Data-driven** — every section renders from JSON in `/data`. Update content by editing JSON; no HTML/JS changes needed.
- 📄 **One data model, two renderers** — the same JSON powers both the live site and a downloadable **CV PDF** (generated client-side with jsPDF).
- 📊 **Skills as honest signal** — grouped by domain with a 5-cell proficiency meter (expert → learning) and Devicon icons.
- 🗂️ **Portfolio with generated art** — each project uses a self-contained, on-brand **SVG cover** (no fragile external images); confidential work carries an NDA badge.
- 📱 **Responsive** — the console collapses into a slide-in drawer on mobile (nav + contact + links + Download CV); zero horizontal overflow.
- 🎨 **One-file theming** — all design tokens live in `css/colors.css`.

## Project structure

```
Portfolio/
├── index.html              # App shell + content slots (filled at runtime)
├── .nojekyll               # Serve files as-is on GitHub Pages
├── CNAME                   # Custom domain (asadalbadi.dev)
├── /css/
│   ├── colors.css          # Design tokens — color, type, spacing, motion (theme lives here)
│   ├── style.css           # Reset, base typography, background, hero, motion
│   ├── layout.css          # App grid, console sidebar, tab bar, mobile drawer
│   └── components.css       # Cards, timeline, skill meters, portfolio, forms
├── /js/
│   ├── data-loader.js      # Fetches all JSON → renders sections into the DOM
│   ├── main.js             # Tabs, mobile drawer, typed hero, local clock
│   ├── portfolio.js        # Portfolio cards + auto tag filters
│   └── pdfGenerator.js     # Builds the CV PDF from the same JSON (jsPDF)
├── /data/                  # <<< ALL CONTENT LIVES HERE >>>
│   ├── profile.json        # Name, title, avatar, contact, social links, footer
│   ├── navigation.json     # Tabs (id, title, active, hidden)
│   ├── about.json          # Intro + "What I Do" services
│   ├── resume.json         # Experience, education, certifications, grouped skills, languages
│   ├── portfolio.json      # Projects (title, description, image, tags, url, isRedacted, logo)
│   ├── interests.json      # Interests, fusion passions, homelab showcase
│   ├── honors.json         # Awards
│   └── contact.json        # Contact form fields + map
└── /assets/images/
    ├── homelab.svg         # Generated homelab rack illustration
    └── /portfolio/         # Generated per-project SVG covers
```

## Run locally

`fetch` needs HTTP, so serve over a local server (don't open `file://`):

```bash
npx live-server --port=5500     # auto-reload
# or
python3 -m http.server 5500
```

Then open `http://127.0.0.1:5500`.

## Edit content

All content is in `/data/*.json`:

- **Profile / sidebar:** `profile.json`
- **Tabs:** `navigation.json` (`hidden: true` removes a tab; `active: true` is the default)
- **About / services:** `about.json`
- **Resume:** `resume.json` — `technicalSkills` is grouped `{category, skills:[{name, level 1–5, icon}]}`; `level` maps to a tier (5 expert · 4 advanced · 3 proficient · 2 familiar · 1 learning)
- **Portfolio:** `portfolio.json` — `tags` build the filter buttons automatically; `isRedacted: true` adds an NDA badge; `logo: true` centers a square icon on a branded panel
- **Interests / homelab:** `interests.json`
- **Honors:** `honors.json`
- **Contact:** `contact.json`

> When changing a JSON shape, update **both** renderers (`data-loader.js` and `pdfGenerator.js`).

## Theming

Edit the CSS custom properties in `css/colors.css` — `--ground`, `--text`, `--accent`, the type scale, spacing, and motion all derive from there.

## Deploy

Hosted on **GitHub Pages** (legacy build) from the `html-js-css` branch root, with the `asadalbadi.dev` custom domain (`CNAME`) and `.nojekyll`. Pushing to `html-js-css` redeploys automatically.

## License

MIT

---

Built by Yousuf Al Rawahi.
