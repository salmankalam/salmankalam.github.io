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

  if (existing.length > 0 && repo.screenshots?.length > 0) {
    console.log(
      `  DONE ${repo.name} — ${existing.length} screenshots exist, skipping`
    );
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  console.log(`  OPEN ${repo.pages_url}`);

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    // Navigate
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
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    if (pageHeight > 1500) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
    }

    const screenshots = [];

    // 1. Hero — viewport at top
    await page.screenshot({ path: path.join(outDir, "hero.png"), fullPage: false });
    screenshots.push({ file: `${relativeDir}/hero.png`, type: "hero", label: "Hero View" });
    console.log(`    → hero.png`);

    // 2. Full page (catches all content after lazy-load triggered)
    await page.screenshot({ path: path.join(outDir, "full.png"), fullPage: true });
    screenshots.push({ file: `${relativeDir}/full.png`, type: "full", label: "Full Page" });
    console.log(`    → full.png`);

    // 3. Mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, "mobile.png"), fullPage: true });
    screenshots.push({ file: `${relativeDir}/mobile.png`, type: "mobile", label: "Mobile View" });
    console.log(`    → mobile.png`);

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

async function main() {
  const repos = reposJson.repos;

  console.log(`Capturing screenshots for ${repos.length} repos…\n`);

  for (const repo of repos) {
    await captureRepo(repo);
    await new Promise((r) => setTimeout(r, 1000));
  }

  fs.writeFileSync(
    path.join(root, "repos.json"),
    JSON.stringify(reposJson, null, 2)
  );

  console.log(`\nDone. repos.json updated with screenshot references.`);
}

main().catch(console.error);
