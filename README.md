# Salman Kalam — Portfolio

> A self-maintaining developer portfolio that hosts, documents, screenshots, and showcases every project you build — automatically.

---

## The Problem

Every developer has a graveyard of projects: repos that work, that you're proud of, that a recruiter should see — but that never make it onto a portfolio.

Why? Because getting one project portfolio-ready is a chore:

- **Hosting** — deploy the frontend, wire up GitHub Pages, fix the build
- **Documenting** — write summaries, pick topics, tag languages
- **Screenshotting** — load the site, capture hero shots, crop, name, store
- **Curating** — keep the list fresh, pin the best work, drop the stale

Multiply that by dozens of projects and nobody does it. The projects rot in GitHub while the portfolio shows three outdated screenshots.

## The Solution

**This repo is a portfolio that maintains itself.**

You push code to GitHub. Everything else — hosting, documenting, screenshotting, listing, and refreshing — is handled automatically by a pipeline that watches your GitHub account.

1. **It tracks your repos.** A daily sync pulls your entire GitHub profile, detects new repositories, and analyzes each one.
2. **It hosts your frontends.** Frontend projects (React, Vite, plain HTML, docs) are automatically deployed to GitHub Pages and linked. Backend and data-analysis projects are detected and categorized instead of left dangling.
3. **It documents each project.** Languages, topics, domains, and summaries are extracted from the repo, its README, and metadata — no writing by hand.
4. **It screenshots every site.** A headless browser visits each deployed app, captures hero/full/route views, and stores them alongside the project.
5. **It curates the portfolio.** New work appears automatically, pinned repos are honored, and externally-hosted projects (Vercel, Lovable, Render) are linked directly — with your own screenshots, named however you like.
6. **It publishes itself.** The portfolio site is rebuilt and deployed on every change, so your profile is always live and current.

## The Execution

The pipeline is three small scripts wired into GitHub Actions:

| Stage | What runs | When |
|---|---|---|
| **Sync** | `scripts/sync_repos.py` — fetch repos, detect frontends, enable Pages, generate summaries/tags, record pinned repos | Daily 06:00 UTC |
| **Capture** | `scripts/capture-screenshots.js` (Playwright) — open each hosted site, screenshot hero/full/content/routes | Daily 06:15 UTC |
| **Deploy** | `npm run build` + `actions/deploy-pages` — ship the Vite site to Pages | On every push |

The only human input is the occasional GitHub token (`PORTFOLIO_PAT`) that grants the pipeline permission to manage your repositories.

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Your GitHub │ ──▶ │  Sync repos  │ ──▶ │  Screenshot  │ ──▶ │  Build site   │
│  repositories│     │  + enable    │     │  every live  │     │  + deploy     │
│              │     │  Pages       │     │  app         │     │  to Pages     │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                            │
                                                            ▼
                                                      repos.json
                                                      public/projects/
```

## The Output

The live site — **https://salmankalam.github.io** — renders everything automatically:

- **Featured** — the repos you've pinned on GitHub, front and center
- **All Projects** — categorized into **Frontend**, **Backend**, and **Data Analysis**, each with screenshots, summaries, tags, and a live link
- **Project previews** — click any card for a lightbox with every captured view, source link, and live site
- **A summary that never goes stale** — new work appears the day you push it

## The Impact

- **Zero maintenance.** Adding a project is just pushing code. The portfolio updates itself overnight.
- **Every project gets its day.** Backends and notebooks get proper cards too — not just pretty UIs.
- **Consistent, real screenshots.** Every site is captured at the same resolution, same moment, by the same headless browser.
- **Recruiter-ready in seconds.** One link shows the breadth of your work: 20+ projects, live and documented, with pinned highlights.

## The Technology

| Layer | Tools |
|---|---|
| **Portfolio site** | React 19, TypeScript, Vite, Tailwind CSS v4, Motion (animations), CVA/clsx |
| **Automation** | Python (requests, GitHub REST + GraphQL APIs), Playwright (headless Chromium) |
| **Hosting & CI/CD** | GitHub Pages, GitHub Actions (`sync-repos.yml`, `capture-screenshots.yml`, `jekyll-gh-pages.yml`), fine-grained PAT |
| **Data** | `repos.json` (source of truth), `public/projects/` (screenshots) |

## How to Run It

```bash
npm install          # install site dependencies
npm run dev          # local dev server
npm run build        # production build to dist/

# Local automation (optional)
export GITHUB_PERSONAL_ACCESS_TOKEN=your_token
python scripts/sync_repos.py          # refresh repos.json
node scripts/capture-screenshots.js   # refresh screenshots
```

The pipeline is fully automated in CI, so none of this is required day-to-day — it's here for manual runs and troubleshooting.

---

*Made with the projects it manages.*