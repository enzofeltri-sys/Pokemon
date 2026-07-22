// Tests des combats de Dresseur: enchaînement multi-Pokémon, récompenses,
// effets onWin, et le cas rare "KO simultané" (dégâts de statut en fin de
// tour qui mettent K.O. notre dernier Pokémon le même tour où l'adversaire
// tombe aussi) qui a causé un vrai bug de rendu par le passé.
const { assert } = require("./helpers");

async function setup(page, baseUrl) {
  await page.goto(`${baseUrl}/index.html`);
  await page.waitForFunction(() => window.PKMN && PKMN.Player && PKMN.BattleState && PKMN.BALANCE);
}

module.exports = [
  {
    name: "Un dresseur à plusieurs Pokémon les envoie un par un, puis verse la récompense",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        PKMN.Player.party = [];
        PKMN.Player.addToParty(1, 50);
        PKMN.Player.money = 0;
        PKMN.BattleState.startTrainer({
          name: "Testeur",
          team: [{ species: 16, level: 5 }, { species: 19, level: 5 }],
          reward: 250,
          onWin: [{ setFlag: "test_trainer_win", value: true }]
        });
        PKMN.switchState("battle");

        // Bat le 1er Pokémon du dresseur.
        PKMN.BattleState.wild.hp = 0;
        PKMN.BattleState.afterTurn();
        const indexAfterFirst = PKMN.BattleState.trainerIndex;
        const stateAfterFirst = PKMN.currentStateName;

        // Bat le 2e (dernier) Pokémon du dresseur.
        PKMN.BattleState.wild.hp = 0;
        PKMN.BattleState.afterTurn();

        return {
          indexAfterFirst,
          stateAfterFirst,
          phaseAfterSecond: PKMN.BattleState.phase,
          money: PKMN.Player.money,
          flag: PKMN.Player.getFlag("test_trainer_win")
        };
      });
      assert(r.indexAfterFirst === 1, `Le dresseur aurait dû passer à son 2e Pokémon (index 1), obtenu ${r.indexAfterFirst}`);
      assert(r.stateAfterFirst === "battle", "Le combat doit continuer après le 1er Pokémon vaincu");
      assert(r.phaseAfterSecond === "message", "Le combat doit afficher les messages de victoire après le dernier Pokémon");
      assert(r.money === 250, `La récompense (250₽) aurait dû être versée, argent obtenu: ${r.money}`);
      assert(r.flag === true, "L'effet onWin (setFlag) aurait dû s'appliquer");
    }
  },

  {
    name: "KO simultané: le combat est gagné mais l'équipe K.O. est quand même soignée",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        PKMN.Player.party = [];
        PKMN.Player.addToParty(1, 50);
        PKMN.Player.money = 0;
        const mon = PKMN.Player.party[0];
        mon.hp = 0; // notre seul Pokémon est déjà tombé ce tour (ex: dégâts de statut)

        PKMN.BattleState.startTrainer({
          name: "Testeur",
          team: [{ species: 16, level: 5 }],
          reward: 100,
          onWin: [{ setFlag: "test_simultaneous_ko", value: true }]
        });
        PKMN.switchState("battle");
        PKMN.BattleState.wild.hp = 0; // l'adversaire tombe aussi ce même tour

        PKMN.BattleState.afterTurn();
        // Vide la file de messages (équivalent à appuyer sur Entrée jusqu'au bout).
        for (let i = 0; i < 200 && PKMN.currentStateName === "battle" && PKMN.BattleState.phase === "message"; i++) PKMN.BattleState.advance();

        return {
          money: PKMN.Player.money,
          flag: PKMN.Player.getFlag("test_simultaneous_ko"),
          partyHp: PKMN.Player.party.map((m) => [m.hp, m.maxHp]),
          finalState: PKMN.currentStateName
        };
      });
      assert(r.money === 100, `La récompense doit toujours être versée même en cas de KO simultané, obtenu ${r.money}`);
      assert(r.flag === true, "Les effets onWin doivent toujours s'appliquer même en cas de KO simultané");
      assert(r.partyHp.every(([hp, maxHp]) => hp === maxHp), "L'équipe entièrement K.O. aurait dû être soignée au centre");
      assert(r.finalState === "overworld", "Le joueur doit être renvoyé à l'overworld (centre de soin), pas bloqué en combat");
    }
  },

  {
    name: "Une nouvelle bataille après un KO simultané n'a plus de Pokémon actif nul (non-régression du crash de rendu)",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        PKMN.Player.party = [];
        PKMN.Player.addToParty(1, 50);
        PKMN.Player.party[0].hp = 0;
        PKMN.BattleState.startTrainer({ name: "T1", team: [{ species: 16, level: 5 }], reward: 10, onWin: [] });
        PKMN.switchState("battle");
        PKMN.BattleState.wild.hp = 0;
        PKMN.BattleState.afterTurn();
        for (let i = 0; i < 200 && PKMN.currentStateName === "battle" && PKMN.BattleState.phase === "message"; i++) PKMN.BattleState.advance();

        // Relance immédiatement un 2e combat: avant le correctif, notre mon
        // restait à 0 PV et PKMN.Player.firstAlive() renvoyait null ici.
        PKMN.BattleState.startTrainer({ name: "T2", team: [{ species: 16, level: 5 }], reward: 10, onWin: [] });
        PKMN.switchState("battle");
        return { active: PKMN.BattleState.active, activeIsNull: PKMN.BattleState.active === null };
      });
      assert(!r.activeIsNull, "Le Pokémon actif ne doit jamais être null au début d'un nouveau combat");
      assert(r.active && r.active.species === 1, "Le Pokémon actif attendu est bien le seul membre de l'équipe, soigné");
    }
  }
];
