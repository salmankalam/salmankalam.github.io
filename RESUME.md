# Self-Maintaining Portfolio — Resume Blurb

**Project:** Automated developer portfolio that hosts, documents, screenshots, and showcases GitHub projects with zero manual upkeep.

- Built a fully automated portfolio system that fetches GitHub repos daily, deploys frontends to GitHub Pages, and captures screenshots of every live project using headless Playwright.
- Classifies each repo into Frontend / Backend / Data Analysis and auto-generates summaries and tags from READMEs, keeping the portfolio fresh without manual editing.
- Wired the whole pipeline into GitHub Actions so new projects are hosted, documented, and added to the site automatically within a day of being pushed.
- Designed a React + TypeScript + Vite UI with animated project cards, category filtering, and per-project lightbox previews, all driven by a single generated `repos.json` data file.