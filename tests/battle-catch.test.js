// Tests de la mécanique de capture (Poké/Super/Hyper Ball). On force
// Math.random pour rendre le tirage de capture déterministe plutôt que de
// dépendre de la chance.
const { assert } = require("./helpers");

async function setup(page, baseUrl) {
  await page.goto(`${baseUrl}/index.html`);
  await page.waitForFunction(() => window.PKMN && PKMN.Player && PKMN.BattleState && PKMN.BALANCE);
}

module.exports = [
  {
    name: "Une capture réussie ajoute le Pokémon à l'équipe et consomme une balle",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        PKMN.Player.party = [];
        PKMN.Player.addToParty(1, 50);
        PKMN.Player.bag = { hyperball: 1 };
        PKMN.BattleState.startWild(16, 5); // Roucool, capture facile
        PKMN.switchState("battle");
        PKMN.BattleState.wild.hp = 1; // PV bas: maximise la chance de capture
        Math.random = () => 0; // garantit la réussite du tirage
        PKMN.BattleState.throwBall("hyperball");
        for (let i = 0; i < 200 && PKMN.currentStateName === "battle" && PKMN.BattleState.phase === "message"; i++) PKMN.BattleState.advance();
        return {
          phase: PKMN.BattleState.phase,
          ballsLeft: PKMN.Player.bag.hyperball,
          partyLen: PKMN.Player.party.length,
          caught: PKMN.Player.pokedexCaught.has(16)
        };
      });
      assert(r.phase === "end", `Le combat devrait se terminer après une capture, phase obtenue: ${r.phase}`);
      assert(r.ballsLeft === 0, "La balle utilisée devrait être consommée");
      assert(r.partyLen === 2, `L'équipe devrait avoir 2 Pokémon après capture, obtenu ${r.partyLen}`);
      assert(r.caught, "Le Pokémon capturé devrait apparaître comme attrapé dans le Pokédex");
    }
  },

  {
    name: "Une capture ratée consomme la balle mais ne capture pas, le combat continue",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        PKMN.Player.party = [];
        PKMN.Player.addToParty(1, 50);
        PKMN.Player.bag = { hyperball: 1 };
        PKMN.BattleState.startWild(16, 5);
        PKMN.switchState("battle");
        Math.random = () => 0.9999; // garantit l'échec du tirage (au-delà du plafond de chance)
        PKMN.BattleState.throwBall("hyperball");
        for (let i = 0; i < 200 && PKMN.currentStateName === "battle" && PKMN.BattleState.phase === "message"; i++) PKMN.BattleState.advance();
        return {
          state: PKMN.currentStateName,
          ballsLeft: PKMN.Player.bag.hyperball,
          partyLen: PKMN.Player.party.length,
          caught: PKMN.Player.pokedexCaught.has(16)
        };
      });
      assert(r.state === "battle", "Le combat doit continuer après une capture ratée");
      assert(r.ballsLeft === 0, "La balle est consommée même en cas d'échec");
      assert(r.partyLen === 1, "L'équipe ne doit pas gagner de membre en cas d'échec");
      assert(!r.caught, "Le Pokémon ne doit pas apparaître comme attrapé en cas d'échec");
    }
  }
];
