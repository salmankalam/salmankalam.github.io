import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const reposJson = JSON.parse(
  fs.readFileSync(path.join(root, "repos.json"), "utf-8")
);

const projectsDir = path.join(root, "public", "projects");

const FOUR04_TITLES = ["Page not found · GitHub Pages", "404"];

// Placeholder cards for repos with no hosted site (backend / data-analysis).
const PLACEHOLDERS = {
  backend: "backend.jpg",
  "data analysis": "data_analysis.jpg",
};

function applyPlaceholder(repo) {
  // Prefer a data-analysis placeholder when the repo is tagged accordingly.
  const domain = repo.tags?.domain || [];
  const key = domain.includes("data analysis") ? "data analysis" : "backend";
  const srcName = PLACEHOLDERS[key];
  const src = path.join(projectsDir, srcName);
  if (!fs.existsSync(src)) {
    console.log(`  SKIP ${repo.name} — placeholder missing: ${srcName}`);
    return;
  }

  const outDir = path.join(projectsDir, repo.name);
  const relDir = `projects/${repo.name}`;
  fs.mkdirSync(outDir, { recursive: true });

  const dest = path.join(outDir, "hero.png");
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`  PLACE ${repo.name} → ${relDir}/hero.png (${srcName})`);
  } else {
    console.log(`  DONE ${repo.name} — placeholder exists, skipping`);
  }

  repo.screenshots = [
    { file: `${relDir}/hero.png`, type: "hero", label: "Hero View" },
  ];
  repo.page_title = repo.name;
  repo.screenshot_error = null;
}

async function captureRepo(repo) {
  if (!repo.pages_enabled || !repo.pages_url) {
    console.log(`  SKIP ${repo.name} — no GitHub Pages`);
    return;
  }

  const outDir = path.join(projectsDir, repo.name);
  const relativeDir = `projects/${repo.name}`;

  const existing = fs.existsSync(outDir)
    ? fs.readdirSync(outDir).filter((f) => f.endsWith(".png"))
    : [];

  const force = Boolean(process.env.FORCE);
  if (existing.length > 0 && repo.screenshots?.length > 0 && !force) {
    console.log(
      `  DONE ${repo.name} — ${existing.length} screenshots exist, skipping`
    );
    return;
  }

  if (force) {
    for (const f of existing) fs.unlinkSync(path.join(outDir, f));
  }

  fs.mkdirSync(outDir, { recursive: true });

  console.log(`  OPEN ${repo.pages_url}`);

  // Local dev uses system Chrome (channel), CI uses Playwright's Chromium.
  const onCI = Boolean(process.env.GITHUB_ACTIONS);
  const browser = await chromium.launch(
    onCI
      ? { headless: true }
      : { channel: "chrome", headless: true }
  );
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    // Navigate to home
    try {
      await page.goto(repo.pages_url, {
        waitUntil: "load",
        timeout: 20000,
      });
    } catch {
      await page.goto(repo.pages_url, {
        waitUntil: "domcontentloaded",
        timeout: 20000,
      });
    }

    const pageTitle = await page.title();

    // Detect 404 page
    if (FOUR04_TITLES.some((t) => pageTitle.includes(t))) {
      console.log(`  SKIP ${repo.name} — page is a 404 (${pageTitle})`);
      repo.page_title = pageTitle;
      repo.screenshots = [];
      repo.screenshot_error = "404";
      return;
    }

    // Scroll to bottom to trigger lazy loading, then back to top
    await triggerLazyLoad(page);

    const screenshots = [];

    // ---- Home page: 3 screenshots (desktop only, no mobile) ----
    // 1. Hero — viewport at top
    await page.screenshot({ path: path.join(outDir, "hero.png"), fullPage: false });
    screenshots.push({ file: `${relativeDir}/hero.png`, type: "hero", label: "Hero View" });
    console.log(`    → hero.png`);

    // 2. Full page (catches all content after lazy-load triggered)
    await page.screenshot({ path: path.join(outDir, "full.png"), fullPage: true });
    screenshots.push({ file: `${relativeDir}/full.png`, type: "full", label: "Full Page" });
    console.log(`    → full.png`);

    // 3. Content — viewport scrolled to the middle section
    await page.evaluate(() =>
      window.scrollTo(0, Math.max(0, (document.body.scrollHeight - window.innerHeight) / 2))
    );
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, "content.png"), fullPage: false });
    screenshots.push({ file: `${relativeDir}/content.png`, type: "content", label: "Content View" });
    console.log(`    → content.png`);

    // ---- One screenshot per internal route (desktop, no mobile) ----
    const routes = await discoverRoutes(page, repo.pages_url);
    for (const [i, route] of routes.entries()) {
      const file = `route-${i + 1}.png`;
      console.log(`    → ${file} (${route.url})`);
      try {
        await page.goto(route.url, { waitUntil: "load", timeout: 20000 });
      } catch {
        await page.goto(route.url, { waitUntil: "domcontentloaded", timeout: 20000 });
      }

      const routeTitle = await page.title();
      if (FOUR04_TITLES.some((t) => routeTitle.includes(t))) {
        console.log(`      SKIP route (404): ${route.url}`);
        continue;
      }

      await triggerLazyLoad(page);
      await page.screenshot({ path: path.join(outDir, file), fullPage: true });
      screenshots.push({
        file: `${relativeDir}/${file}`,
        type: "route",
        label: route.label || new URL(route.url).pathname || `Route ${i + 1}`,
      });
    }

    repo.screenshots = screenshots;
    repo.page_title = pageTitle || repo.name;
    repo.screenshot_error = null;

    console.log(`  OK  ${repo.name} — ${screenshots.length} screenshots`);
  } catch (err) {
    console.error(`  ERR  ${repo.name} — ${err.message}`);
  } finally {
    await browser.close();
  }
}

// Scroll to the bottom (trigger lazy load), then back to the top.
async function triggerLazyLoad(page) {
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  if (pageHeight > 1500) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
  }
}

// Collect unique internal routes (links to pages on the same site).
async function discoverRoutes(page, pagesUrl) {
  const base = new URL(pagesUrl);
  const MAX_ROUTES = Number(process.env.MAX_ROUTES || 8);

  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")].map((a) => ({
      href: a.getAttribute("href"),
      text: (a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
    }))
  );

  const seen = new Set();
  const routes = [];
  for (const link of links) {
    let url;
    try {
      url = new URL(link.href, base);
    } catch {
      continue;
    }

    const href = link.href;
    const isHashOnly =
      href.startsWith("#") || (href.startsWith(base.pathname) && href.includes("#"));

    // Internal anchor links on the home page are not routes.
    if (url.hash && url.pathname === base.pathname && !href.startsWith("#/")) continue;
    // Skip fragments-only and javascript:/mailto: links.
    if (isHashOnly && !href.startsWith("#/")) continue;
    if (/^(javascript|mailto|tel|data):/.test(href)) continue;
    // Skip same-origin home page itself and external sites.
    if (url.origin !== base.origin) continue;
    if (url.pathname === base.pathname && url.search === base.search) continue;
    // Skip in-page anchors on the same path (non-hash-router).
    if (url.hash && !href.startsWith("#/")) continue;

    const key = url.href.replace(/#.*$/, "");
    if (seen.has(key)) continue;
    seen.add(key);

    routes.push({ url: url.href, label: link.text || url.pathname });
    if (routes.length >= MAX_ROUTES) break;
  }

  return routes;
}

async function main() {
  const repos = reposJson.repos;

  console.log(`Capturing screenshots for ${repos.length} repos…\n`);

  for (const repo of repos) {
    if (repo.pages_enabled && repo.pages_url) {
      await captureRepo(repo);
    } else {
      applyPlaceholder(repo);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  fs.writeFileSync(
    path.join(root, "repos.json"),
    JSON.stringify(reposJson, null, 2)
  );

  console.log(`\nDone. repos.json updated with screenshot references.`);
}

main().catch(console.error);
