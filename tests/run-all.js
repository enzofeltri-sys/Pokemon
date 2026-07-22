// Lance tous les fichiers tests/*.test.js contre une instance locale du jeu.
// Usage: node tests/run-all.js  (ou "npm test" depuis la racine du projet)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { startServer } = require("./helpers");

const PORT = 8973;
const CHROMIUM_PATH = "/opt/pw-browsers/chromium"; // présent dans cet environnement de dev; sinon Playwright utilise son propre binaire téléchargé.

async function main() {
  const server = await startServer(PORT);
  const baseUrl = `http://localhost:${PORT}`;
  const launchOpts = fs.existsSync(CHROMIUM_PATH) ? { executablePath: CHROMIUM_PATH } : {};
  const browser = await chromium.launch(launchOpts);

  const testFiles = fs.readdirSync(__dirname).filter((f) => f.endsWith(".test.js")).sort();
  let total = 0, failed = 0;
  const failures = [];

  for (const file of testFiles) {
    const cases = require(path.join(__dirname, file));
    for (const { name, run } of cases) {
      total++;
      const context = await browser.newContext();
      const page = await context.newPage();
      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error" && !/net::ERR_|404/.test(msg.text())) consoleErrors.push(msg.text());
      });
      page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message));
      try {
        await run(page, baseUrl);
        if (consoleErrors.length) throw new Error("Erreurs console inattendues: " + consoleErrors.join(" | "));
        console.log(`  OK   ${file} :: ${name}`);
      } catch (e) {
        failed++;
        failures.push(`${file} :: ${name}\n      -> ${e.message}`);
        console.log(`  FAIL ${file} :: ${name}\n      -> ${e.message}`);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  server.close();

  console.log(`\n${total - failed}/${total} tests passés.`);
  if (failed) {
    console.log("\nÉchecs:");
    failures.forEach((f) => console.log(" - " + f));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Erreur inattendue du lanceur de tests:", e);
  process.exit(1);
});
