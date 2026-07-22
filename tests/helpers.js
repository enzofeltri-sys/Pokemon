// Utilitaires partagés par les tests du moteur de combat. Pas de framework de
// test externe : chaque fichier `*.test.js` exporte un tableau
// `[{ name, run(page, baseUrl) }, ...]`, et `run-all.js` les exécute tous
// avec Playwright contre une petite instance du jeu servie en local.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png"
};

function startServer(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      const filePath = path.join(ROOT, urlPath === "/" ? "/index.html" : urlPath);
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(port, () => resolve(server));
  });
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || "Assertion échouée");
}

function makePress(page) {
  return async (key, n = 1) => {
    for (let i = 0; i < n; i++) {
      await page.keyboard.press(key);
      await page.waitForTimeout(120);
    }
  };
}

// Vide toute file de dialogue en attente, jusqu'à revenir à l'overworld ou
// déclencher autre chose (ex: un combat).
async function drainDialogue(page, press, max = 15) {
  for (let i = 0; i < max; i++) {
    const state = await page.evaluate(() => PKMN.currentStateName);
    if (state !== "dialogue") return state;
    await press("Enter");
  }
  return page.evaluate(() => PKMN.currentStateName);
}

// Joue un combat jusqu'au bout en choisissant toujours la 1ère attaque et en
// gérant les changements forcés de Pokémon K.O. Renvoie l'état final.
async function winBattle(page, press, max = 400) {
  for (let i = 0; i < max; i++) {
    const state = await page.evaluate(() => PKMN.currentStateName);
    if (state !== "battle") return state;
    const phase = await page.evaluate(() => PKMN.BattleState.phase);
    if (phase === "message" || phase === "main_menu" || phase === "move_menu") {
      await press("Enter");
    } else if (phase === "party_menu") {
      const idx = await page.evaluate(() => PKMN.Player.party.findIndex((m) => m.hp > 0));
      const sel = await page.evaluate(() => PKMN.BattleState.menuSel);
      const n = await page.evaluate(() => PKMN.Player.party.length);
      if (idx >= 0 && idx !== sel) await press("ArrowDown", (idx - sel + n) % n);
      await press("Enter");
    } else if (phase === "end") {
      await press("Enter");
      return page.evaluate(() => PKMN.currentStateName);
    }
    await page.waitForTimeout(30);
  }
  return "timeout";
}

// Charge le jeu et saute l'écran titre jusqu'à l'overworld (partie déjà
// démarrée avec le starter par défaut).
async function bootToOverworld(page, baseUrl) {
  await page.goto(`${baseUrl}/index.html`);
  await page.waitForTimeout(250);
  const press = makePress(page);
  await press("Enter"); await press("Enter"); await press("Enter");
  await page.waitForTimeout(150);
  return press;
}

module.exports = { startServer, assert, makePress, drainDialogue, winBattle, bootToOverworld };
