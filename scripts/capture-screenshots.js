import { chromium } from "playwright";
import { PNG } from "pngjs";
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

// A screenshot is "blank" when its pixels are nearly uniform (very low
// luminance variance) — covers both white-blank and the near-black blank
// heroes some dark-themed sites produce before they finish rendering.
function isBlankBuffer(buf) {
  let png;
  try {
    png = PNG.sync.read(buf);
  } catch {
    return false;
  }
  const { data, width, height } = png;
  if (!width || !height) return true;
  let sum = 0;
  let sumSq = 0;
  let n = 0;
  const step = Math.max(4, Math.floor(width * height / 4000) * 4);
  for (let i = 0; i < data.length; i += step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    sum += lum;
    sumSq += lum * lum;
    n++;
  }
  if (n === 0) return true;
  const mean = sum / n;
  const variance = sumSq / n - mean * mean;
  const std = Math.sqrt(Math.max(0, variance));
  return std < 12;
}

function isBlankFile(p) {
  try {
    return isBlankBuffer(fs.readFileSync(p));
  } catch {
    // Missing or unreadable file → treat as blank so it gets retried.
    return true;
  }
}

// Capture a screenshot, and if it comes out blank, re-settle the page and
// re-shoot (up to 3 retries). `shootFn` performs the actual screenshot after
// any page-specific scrolling has been applied by the caller.
async function shootWithRetry(page, url, shootFn, outPath, label) {
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) {
      try {
        await page.goto(url, { waitUntil: "load", timeout: 20000 });
      } catch {
        try {
          await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
        } catch {
          /* ignore */
        }
      }
      await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(2500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
    }
    try {
      await shootFn();
    } catch (e) {
      console.log(`      ERR shoot ${label}: ${e.message}`);
    }
    if (!isBlankFile(outPath)) return true;
    console.log(`      RETRY ${label} — blank (attempt ${attempt + 1})`);
  }
  console.log(`      WARN ${label} still blank after retries`);
  return false;
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
    // Re-capture only if any existing screenshot is blank; otherwise leave
    // the repo alone (don't disturb repos with good screenshots).
    const anyBlank = existing.some((f) => isBlankFile(path.join(outDir, f)));
    if (!anyBlank) {
      console.log(
        `  DONE ${repo.name} — ${existing.length} screenshots exist, skipping`
      );
      return;
    }
    console.log(
      `  BLANK ${repo.name} — existing screenshots are blank, re-capturing`
    );
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

    // A meta-refresh redirect (e.g. index.html → guide.html) fires a navigation
    // right after load, which destroys the execution context. Wait until the
    // page settles before interacting with it.
    for (let i = 0; i < 10; i++) {
      try {
        await page.evaluate(() => document.readyState);
        await page.waitForLoadState("networkidle").catch(() => {});
        break;
      } catch {
        await page.waitForTimeout(500);
      }
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

    // ---- Home page: hero + content (no full-page capture) ----
    // 1. Hero — viewport at top
    const heroPath = path.join(outDir, "hero.png");
    await shootWithRetry(
      page,
      repo.pages_url,
      () => page.screenshot({ path: heroPath, fullPage: false }),
      heroPath,
      "hero"
    );
    screenshots.push({ file: `${relativeDir}/hero.png`, type: "hero", label: "Hero View" });
    console.log(`    → hero.png`);

    // 2. Content — viewport scrolled to the middle section
    const contentPath = path.join(outDir, "content.png");
    await shootWithRetry(
      page,
      repo.pages_url,
      () => {
        return page.evaluate(() =>
          window.scrollTo(0, Math.max(0, (document.body.scrollHeight - window.innerHeight) / 2))
        ).then(() => page.waitForTimeout(500))
          .then(() => page.screenshot({ path: contentPath, fullPage: false }));
      },
      contentPath,
      "content"
    );
    screenshots.push({ file: `${relativeDir}/content.png`, type: "content", label: "Content View" });
    console.log(`    → content.png`);

    // ---- Internal routes OR in-page sections ----
    const routes = await discoverRoutes(page, repo.pages_url);
    if (routes.length > 0) {
      // Multi-page / SPA sites: one screenshot per internal route.
      for (const [i, route] of routes.entries()) {
        const file = `route-${i + 1}.png`;
        console.log(`    → ${file} (${route.url})`);
        try {
          await page.goto(route.url, { waitUntil: "load", timeout: 20000 });
        } catch {
          await page.goto(route.url, { waitUntil: "domcontentloaded", timeout: 20000 });
        }

        for (let i = 0; i < 10; i++) {
          try {
            await page.evaluate(() => document.readyState);
            await page.waitForLoadState("networkidle").catch(() => {});
            break;
          } catch {
            await page.waitForTimeout(500);
          }
        }

        const routeTitle = await page.title();
        if (FOUR04_TITLES.some((t) => routeTitle.includes(t))) {
          console.log(`      SKIP route (404): ${route.url}`);
          continue;
        }

        await triggerLazyLoad(page);
        const rPath = path.join(outDir, file);
        await shootWithRetry(
          page,
          route.url,
          () => page.screenshot({ path: rPath, fullPage: true }),
          rPath,
          file
        );
        screenshots.push({
          file: `${relativeDir}/${file}`,
          type: "route",
          label: route.label || new URL(route.url).pathname || `Route ${i + 1}`,
        });
      }
    } else {
      // Single-page / HTML sites have no internal routes: screenshot each
      // in-page #section (up to MAX_ROUTES), or fall back to evenly-spaced
      // scroll positions when the page exposes no anchor links.
      const sections = await discoverSections(page, repo.pages_url);
      const shots = sections.length > 0
        ? sections.map((s) => ({ id: s.id, label: s.label }))
        : (await scrollFractionShots(page)).map((s) => ({ y: s.y, label: s.label }));
      for (const [i, shot] of shots.entries()) {
        const file = `section-${i + 1}.png`;
        console.log(`    → ${file} (${shot.label})`);
        const sPath = path.join(outDir, file);
        await shootWithRetry(
          page,
          repo.pages_url,
          () => {
            if (shot.id) {
              return page
                .evaluate((elId) => {
                  const el = document.getElementById(elId);
                  if (el) el.scrollIntoView({ block: "start" });
                  window.scrollBy(0, -80);
                }, shot.id)
                .then(() => page.waitForTimeout(500))
                .then(() => page.screenshot({ path: sPath, fullPage: false }));
            }
            return page
              .evaluate((yy) => window.scrollTo(0, yy), shot.y)
              .then(() => page.waitForTimeout(500))
              .then(() => page.screenshot({ path: sPath, fullPage: false }));
          },
          sPath,
          file
        );
        screenshots.push({
          file: `${relativeDir}/${file}`,
          type: "section",
          label: shot.label || `Section ${i + 1}`,
        });
      }
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
    // Skip same-origin home page itself and external sites. SPA hash routes
    // like #/components are NOT the bare home page, so keep them.
    if (url.origin !== base.origin) continue;
    if (
      url.pathname === base.pathname &&
      url.search === base.search &&
      (!url.hash || url.hash === "#" || url.hash === "#/")
    )
      continue;
    // Skip in-page anchors on the same path (non-hash-router).
    if (url.hash && !href.startsWith("#/")) continue;
    // Only count as an internal route if it's a hash route or lives under the
    // same base path. Links to other areas of the site are not project routes.
    if (!href.startsWith("#/") && !url.pathname.startsWith(base.pathname)) continue;

    const key = url.href.replace(/#.*$/, "");
    if (seen.has(key)) continue;
    seen.add(key);

    routes.push({ url: url.href, label: link.text || url.pathname });
    if (routes.length >= MAX_ROUTES) break;
  }

  return routes;
}

// For single-page / HTML sites that have no internal page routes, collect the
// in-page #anchor links (e.g. nav to #commands) and screenshot each target
// section. Up to MAX_ROUTES sections, mirroring the route capture for SPAs.
async function discoverSections(page, pagesUrl) {
  const base = new URL(pagesUrl);
  const MAX = Number(process.env.MAX_ROUTES || 8);

  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a[href]")].map((a) => ({
      href: a.getAttribute("href"),
      text: (a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
    }))
  );

  const seen = new Set();
  const sections = [];
  for (const link of links) {
    const href = link.href || "";
    let id;
    try {
      const url = new URL(href, base);
      if (url.origin !== base.origin) continue;
      const pre = href.split("#")[0];
      if (
        pre &&
        pre !== base.pathname &&
        pre !== base.pathname.replace(/\/$/, "")
      ) {
        continue;
      }
      id = url.hash.slice(1);
    } catch {
      continue;
    }
    if (!id) continue;
    if (seen.has(id)) continue;

    const exists = await page
      .evaluate((elId) => {
        const el = document.getElementById(elId);
        return !!el && el.getBoundingClientRect().height > 0;
      }, id)
      .catch(() => false);
    if (!exists) continue;

    seen.add(id);
    sections.push({ id, label: link.text || id });
    if (sections.length >= MAX) break;
  }

  return sections;
}

// For single-page / JS-routed sites with no anchor links to discover, capture
// several evenly-spaced scroll-position screenshots so the project still gets
// multiple shots instead of just hero + content.
async function scrollFractionShots(page) {
  const MAX = Number(process.env.MAX_ROUTES || 8);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => window.innerHeight);
  if (!total || !vh || total <= vh * 1.1) return [];
  const count = Math.min(MAX, Math.max(2, Math.floor((total - vh) / vh) + 1));
  const shots = [];
  for (let k = 0; k < count; k++) {
    const y =
      count === 1 ? 0 : Math.min(total - vh, Math.round(((total - vh) * k) / (count - 1)));
    shots.push({ y, label: `View ${k + 1}` });
  }
  return shots;
}

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"]);

// Display order for screenshot categories: hero first, then content, then
// in-page #sections, then internal routes.
const TYPE_RANK = { hero: 0, content: 1, full: 2, section: 3, route: 4 };

function typeOfFile(f) {
  const base = f.replace(/\.\w+$/i, "").toLowerCase();
  // The canonical hero is exactly "hero.png". Other hero-* / heroN variants
  // (hero-filtered, hero-budget, hero2, hero-3, …) are extra feature shots,
  // NOT the hero.
  if (base === "hero") return "hero";
  if (base === "content") return "content";
  if (base === "full") return "full";
  if (/^section-\d+$/i.test(base)) return "section";
  if (/^route/i.test(base)) return "route"; // route, route-1, route-aitools, route1, …
  if (base.startsWith("hero")) return "section"; // extra hero shots
  return "section"; // any other screenshot (mobile.png, filtered.png, data_analysis.jpg, …)
}

// Order screenshots as hero -> content -> full -> sections -> routes, keeping
// the numeric suffix order within each category.
function sortScreenshots(list) {
  const numOf = (s) => Number((path.basename(s.file).match(/(\d+)\./) || [])[1]) || 0;
  return list.sort((a, b) => {
    const ra = TYPE_RANK[a.type] ?? 9;
    const rb = TYPE_RANK[b.type] ?? 9;
    if (ra !== rb) return ra - rb;
    return numOf(a) - numOf(b);
  });
}

// Build a screenshots array from whatever image files already exist in the
// repo's project folder. The type is derived from the filename (so the real
// hero.png is correctly identified as the hero) and then ordered
// hero -> content -> sections -> routes.
function scanLocalImages(repo) {
  const outDir = path.join(projectsDir, repo.name);
  if (!fs.existsSync(outDir)) return null;

  const files = fs
    .readdirSync(outDir)
    .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()));

  if (files.length === 0) return null;

  const list = files.map((f) => {
    const type = typeOfFile(f);
    const num = Number((f.match(/(\d+)\./) || [])[1]) || 0;
    const label =
      type === "hero"
        ? "Hero View"
        : type === "content"
        ? "Content View"
        : type === "section"
        ? `Section ${num || ""}`.trim()
        : type === "route"
        ? `Route ${num || ""}`.trim()
        : path.basename(f, path.extname(f));
    return { file: `projects/${repo.name}/${f}`, type, label };
  });

  return sortScreenshots(list);
}

async function main() {
  const repos = reposJson.repos;

  console.log(`Processing screenshots for ${repos.length} repos…\n`);

  for (const repo of repos) {
    // 1. User has dropped custom images into the project folder — use them as-is,
    //    preserving their filenames and order. Re-capture instead if any is blank.
    const local = scanLocalImages(repo);
    const localBlank = local
      ? local.some((s) =>
          isBlankFile(path.join(projectsDir, repo.name, path.basename(s.file)))
        )
      : false;

    if (local && !localBlank) {
      repo.screenshots = local;
      repo.page_title = repo.page_title || repo.name;
      repo.screenshot_error = null;
      console.log(
        `  SCAN ${repo.name} — using ${local.length} existing image(s): ${local
          .map((s) => path.basename(s.file))
          .join(", ")}`
      );
      await new Promise((r) => setTimeout(r, 300));
      continue;
    }

    if (localBlank) {
      console.log(
        `  BLANK ${repo.name} — existing local screenshots are blank, re-capturing`
      );
      // fall through to re-capture
    } else if (Array.isArray(repo.screenshots) && repo.screenshots.length > 0) {
      // 2. Already has screenshots in repos.json (user-managed) — never touch.
      console.log(
        `  KEEP ${repo.name} — ${repo.screenshots.length} screenshots already set, skipping`
      );
      continue;
    }

    // 3. Externally hosted with no local images — skip entirely.
    if (repo.hostedByTheUser) {
      console.log(
        `  SKIP ${repo.name} — hosted by user (${repo.hostedByTheUserLink || "external link"}), no images`
      );
      continue;
    }

    // 4. Live Pages site — auto-capture.
    if (repo.pages_enabled && repo.pages_url) {
      await captureRepo(repo);
    } else {
      applyPlaceholder(repo);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Normalize ordering for every repo so the hero is always first, regardless
  // of how the screenshots were originally captured or stored.
  for (const repo of repos) {
    if (Array.isArray(repo.screenshots)) sortScreenshots(repo.screenshots);
  }

  fs.writeFileSync(
    path.join(root, "repos.json"),
    JSON.stringify(reposJson, null, 2)
  );

  console.log(`\nDone. repos.json updated with screenshot references.`);
}

main().catch(console.error);
