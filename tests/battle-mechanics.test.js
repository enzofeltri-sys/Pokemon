// Tests du moteur de combat "bas niveau": efficacité des types, immunités
// liées aux talents, objets tenus. On pilote PKMN.BattleState directement
// (sans passer par le clavier) pour des tests rapides et non aléatoires.
const { assert } = require("./helpers");

async function setup(page, baseUrl) {
  await page.goto(`${baseUrl}/index.html`);
  await page.waitForFunction(() => window.PKMN && PKMN.Player && PKMN.BattleState && PKMN.BALANCE);
}

module.exports = [
  {
    name: "Table des types : quelques matchups de référence",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => ({
        feuVsPlante: PKMN.getEffectiveness("feu", ["plante"]),
        eauVsFeu: PKMN.getEffectiveness("eau", ["feu"]),
        normalVsSpectre: PKMN.getEffectiveness("normal", ["spectre"]),
        electrikVsSol: PKMN.getEffectiveness("electrik", ["sol"])
      }));
      assert(r.feuVsPlante === 2, `Feu vs Plante devrait valoir x2 (obtenu ${r.feuVsPlante})`);
      assert(r.eauVsFeu === 2, `Eau vs Feu devrait valoir x2 (obtenu ${r.eauVsFeu})`);
      assert(r.normalVsSpectre === 0, `Normal vs Spectre devrait valoir x0 (obtenu ${r.normalVsSpectre})`);
      assert(r.electrikVsSol === 0, `Électrik vs Sol devrait valoir x0 (obtenu ${r.electrikVsSol})`);
    }
  },

  {
    name: "Lévitation immunise contre les capacités de type Sol",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        Math.random = () => 0; // garantit le contact (jamais d'esquive)
        PKMN.Player.party = [];
        PKMN.Player.addToParty(1, 50);
        PKMN.Player.party[0].moves = [{ key: "seisme", pp: 10, maxPp: 10 }];
        PKMN.BattleState.startWild(81, 50); // Magnéti
        PKMN.BattleState.wild.ability = "levitation"; // talents multiples: on fixe celui qu'on veut tester
        PKMN.switchState("battle");
        const before = PKMN.BattleState.wild.hp;
        PKMN.BattleState.doMoveAction(PKMN.BattleState.active, PKMN.BattleState.wild, PKMN.BattleState.active.moves[0], [], false);
        return { before, after: PKMN.BattleState.wild.hp };
      });
      assert(r.after === r.before, `Magnéti aurait dû être totalement immunisé (PV ${r.before} -> ${r.after})`);
    }
  },

  {
    name: "Baie Oran se déclenche uniquement sous le seuil configuré",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        PKMN.Player.party = [];
        PKMN.Player.addToParty(1, 50);
        PKMN.BattleState.startWild(16, 5);
        PKMN.switchState("battle");
        const mon = PKMN.BattleState.active;
        mon.heldItem = "baie_oran";
        mon.status = "poison";
        mon.maxHp = 100;

        mon.hp = 40; // au-dessus du seuil (25%) même après les dégâts de poison
        PKMN.BattleState.finishTurnMessages([]);
        const afterAbove = { hp: mon.hp, heldItem: mon.heldItem };

        mon.heldItem = "baie_oran";
        mon.status = "poison";
        mon.hp = 20; // tombera sous le seuil après les dégâts de poison
        PKMN.BattleState.finishTurnMessages([]);
        const afterBelow = { hp: mon.hp, heldItem: mon.heldItem };

        return { afterAbove, afterBelow };
      });
      assert(r.afterAbove.heldItem === "baie_oran", "La baie n'aurait pas dû se déclencher au-dessus du seuil");
      assert(r.afterBelow.heldItem === null, "La baie aurait dû se déclencher et être consommée sous le seuil");
      assert(r.afterBelow.hp === 28, `PV attendus après déclenchement de la baie: 28 (obtenu ${r.afterBelow.hp})`);
    }
  }
];
