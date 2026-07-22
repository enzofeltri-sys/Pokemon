// Tests de la progression (montée de niveau, partage d'XP "Multi Exp").
const { assert } = require("./helpers");

async function setup(page, baseUrl) {
  await page.goto(`${baseUrl}/index.html`);
  await page.waitForFunction(() => window.PKMN && PKMN.Player && PKMN.BattleState && PKMN.BALANCE);
}

module.exports = [
  {
    name: "gainExp fait monter de niveau et recalcule les statistiques",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        PKMN.Player.party = [];
        const mon = PKMN.Player.addToParty(1, 5);
        const hpBefore = mon.stats.hp;
        const needed = PKMN.xpToNextLevel(5);
        PKMN.gainExp(mon, needed);
        return { level: mon.level, xp: mon.xp, hpBefore, hpAfter: mon.stats.hp };
      });
      assert(r.level === 6, `Le Pokémon aurait dû passer niveau 6, obtenu ${r.level}`);
      assert(r.xp === 0, `L'XP excédentaire aurait dû être exactement consommée, obtenu ${r.xp}`);
      assert(r.hpAfter > r.hpBefore, "Les PV max devraient augmenter avec le niveau");
    }
  },

  {
    name: "Option Multi Exp: un Pokémon resté au banc gagne la moitié de l'XP seulement si activée",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const withMultiExp = await page.evaluate(() => {
        PKMN.Player.party = [];
        PKMN.Player.addToParty(1, 50); // participant (actif)
        const benched = PKMN.Player.addToParty(4, 50); // reste au banc, ne participe pas
        PKMN.Player.options.multiExp = true;
        PKMN.BattleState.startTrainer({ name: "T", team: [{ species: 16, level: 5 }], reward: 0, onWin: [] });
        PKMN.switchState("battle"); // participants = { party[0] } uniquement
        PKMN.BattleState.wild.hp = 0;
        PKMN.BattleState.afterTurn();
        return benched.xp;
      });
      const withoutMultiExp = await page.evaluate(() => {
        PKMN.Player.party = [];
        PKMN.Player.addToParty(1, 50);
        const benched = PKMN.Player.addToParty(4, 50);
        PKMN.Player.options.multiExp = false;
        PKMN.BattleState.startTrainer({ name: "T", team: [{ species: 16, level: 5 }], reward: 0, onWin: [] });
        PKMN.switchState("battle");
        PKMN.BattleState.wild.hp = 0;
        PKMN.BattleState.afterTurn();
        return benched.xp;
      });
      assert(withMultiExp > 0, "Avec Multi Exp activé, le Pokémon au banc devrait gagner de l'XP");
      assert(withoutMultiExp === 0, "Sans Multi Exp, le Pokémon au banc ne devrait gagner aucune XP");
    }
  }
];
