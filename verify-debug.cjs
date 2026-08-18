const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(10000);
  await page.goto("http://localhost:5173", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1200);

  // Certificates section
  await page.evaluate(() => document.getElementById("certificates").scrollIntoView());
  await page.waitForTimeout(600);
  await page.screenshot({ path: "shot-certificates.png", animations: "disabled" });

  // Open first certificate modal
  await page.evaluate(() => document.querySelector("#certificates button").click());
  await page.waitForTimeout(600);
  const modal = await page.evaluate(() => {
    const m = document.querySelector("[data-cert-modal]");
    return m ? "modal open" : "no marker";
  });
  const hasImg = await page.evaluate(() => {
    const imgs = document.querySelectorAll(".fixed img");
    return imgs.length;
  });
  console.log("modal state:", modal, "| images in modal:", hasImg);
  await page.screenshot({ path: "shot-cert-modal.png", animations: "disabled" });
  await page.evaluate(() => document.querySelector(".fixed button").click());

  // Resume section
  await page.evaluate(() => document.getElementById("resume").scrollIntoView());
  await page.waitForTimeout(600);
  await page.screenshot({ path: "shot-resume.png", animations: "disabled" });
  console.log("done");
  await browser.close();
})();
