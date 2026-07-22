// Tests des statuts de combat (poison/brûlure/paralysie/gel/confusion) et de
// leurs interactions avec les constantes centralisées dans data/balance.js.
const { assert } = require("./helpers");

async function setup(page, baseUrl) {
  await page.goto(`${baseUrl}/index.html`);
  await page.waitForFunction(() => window.PKMN && PKMN.Player && PKMN.BattleState && PKMN.BALANCE);
  await page.evaluate(() => {
    PKMN.Player.party = [];
    PKMN.Player.addToParty(1, 50);
    PKMN.BattleState.startWild(16, 50);
    PKMN.switchState("battle");
    PKMN.BattleState.active.moves = [{ key: "charge", pp: 35, maxPp: 35 }];
  });
}

module.exports = [
  {
    name: "Poison / Brûlure / Toxic infligent exactement les fractions configurées",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        const BAL = PKMN.BALANCE;
        const mon = PKMN.BattleState.active;
        mon.maxHp = 160;

        mon.status = "poison"; mon.hp = 160;
        PKMN.BattleState.finishTurnMessages([]);
        const poisonDmg = 160 - mon.hp;

        mon.status = "burn"; mon.hp = 160;
        PKMN.BattleState.finishTurnMessages([]);
        const burnDmg = 160 - mon.hp;

        mon.status = "toxic"; mon.statusCounter = 1; mon.hp = 160;
        PKMN.BattleState.finishTurnMessages([]);
        const toxicDmg1 = 160 - mon.hp;
        PKMN.BattleState.finishTurnMessages([]); // 2e tour: dégâts croissants
        const toxicDmg2 = (160 - toxicDmg1) - mon.hp;

        return {
          poisonDmg, burnDmg, toxicDmg1, toxicDmg2,
          expectedPoison: Math.floor(160 * BAL.POISON_FRACTION),
          expectedBurn: Math.floor(160 * BAL.BURN_FRACTION),
          expectedToxic1: Math.floor((160 * 1) / BAL.TOXIC_FRACTION_DIVISOR),
          expectedToxic2: Math.floor((160 * 2) / BAL.TOXIC_FRACTION_DIVISOR)
        };
      });
      assert(r.poisonDmg === r.expectedPoison, `Dégâts de poison attendus ${r.expectedPoison}, obtenu ${r.poisonDmg}`);
      assert(r.burnDmg === r.expectedBurn, `Dégâts de brûlure attendus ${r.expectedBurn}, obtenu ${r.burnDmg}`);
      assert(r.toxicDmg1 === r.expectedToxic1, `Dégâts de toxic (tour 1) attendus ${r.expectedToxic1}, obtenu ${r.toxicDmg1}`);
      assert(r.toxicDmg2 === r.expectedToxic2, `Dégâts de toxic (tour 2, croissants) attendus ${r.expectedToxic2}, obtenu ${r.toxicDmg2}`);
      assert(r.toxicDmg2 > r.toxicDmg1, "Les dégâts de toxic doivent augmenter à chaque tour");
    }
  },

  {
    name: "Paralysie totale bloque l'action et divise la vitesse effective",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        Math.random = () => 0; // force le blocage total (chance configurée > 0)
        const mon = PKMN.BattleState.active;
        mon.status = "paralysis";
        mon.stats.spe = 100;
        mon.statStages.spe = 0;
        const wildHpBefore = PKMN.BattleState.wild.hp;
        const msgs = [];
        PKMN.BattleState.doMoveAction(mon, PKMN.BattleState.wild, mon.moves[0], msgs, false);
        return {
          wildHpBefore, wildHpAfter: PKMN.BattleState.wild.hp,
          moveBlocked: msgs.some((m) => m.includes("ne peut pas bouger")),
          effectiveSpeed: PKMN.BattleState.effectiveSpeed(mon),
          expectedSpeed: 100 * PKMN.BALANCE.PARALYSIS_SPEED_MULTIPLIER
        };
      });
      assert(r.moveBlocked, "Le message de paralysie totale devrait apparaître");
      assert(r.wildHpAfter === r.wildHpBefore, "Aucune attaque ne devrait porter en cas de paralysie totale");
      assert(r.effectiveSpeed === r.expectedSpeed, `Vitesse effective attendue ${r.expectedSpeed}, obtenu ${r.effectiveSpeed}`);
    }
  },

  {
    name: "Gel: peut dégeler (et attaquer) ou rester bloqué selon la chance",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const thawed = await page.evaluate(() => {
        Math.random = () => 0; // force le dégel
        const mon = PKMN.BattleState.active;
        mon.status = "freeze";
        const wildHpBefore = PKMN.BattleState.wild.hp;
        const msgs = [];
        PKMN.BattleState.doMoveAction(mon, PKMN.BattleState.wild, mon.moves[0], msgs, false);
        return { status: mon.status, wildHpBefore, wildHpAfter: PKMN.BattleState.wild.hp };
      });
      assert(thawed.status === null, "Le Pokémon aurait dû dégeler");
      assert(thawed.wildHpAfter < thawed.wildHpBefore, "Un Pokémon dégelé doit pouvoir attaquer ce même tour");

      const stillFrozen = await page.evaluate(() => {
        Math.random = () => 0.99; // force à rester gelé
        const mon = PKMN.BattleState.active;
        mon.status = "freeze";
        mon.hp = mon.maxHp;
        const wildHpBefore = PKMN.BattleState.wild.hp;
        const msgs = [];
        PKMN.BattleState.doMoveAction(mon, PKMN.BattleState.wild, mon.moves[0], msgs, false);
        return { status: mon.status, wildHpBefore, wildHpAfter: PKMN.BattleState.wild.hp };
      });
      assert(stillFrozen.status === "freeze", "Le Pokémon aurait dû rester gelé");
      assert(stillFrozen.wildHpAfter === stillFrozen.wildHpBefore, "Un Pokémon gelé ne doit pas pouvoir attaquer");
    }
  },

  {
    name: "Confusion: peut se blesser soi-même selon la chance configurée",
    async run(page, baseUrl) {
      await setup(page, baseUrl);
      const r = await page.evaluate(() => {
        Math.random = () => 0; // force le coup dans la confusion
        const mon = PKMN.BattleState.active;
        mon.confused = 1;
        mon.stats.atk = 100;
        mon.hp = mon.maxHp;
        const wildHpBefore = PKMN.BattleState.wild.hp;
        const hpBefore = mon.hp;
        const msgs = [];
        PKMN.BattleState.doMoveAction(mon, PKMN.BattleState.wild, mon.moves[0], msgs, false);
        return {
          selfDmg: hpBefore - mon.hp,
          wildUnaffected: PKMN.BattleState.wild.hp === wildHpBefore,
          expectedSelfDmg: Math.floor(100 * PKMN.BALANCE.CONFUSE_SELF_DAMAGE_MULTIPLIER)
        };
      });
      assert(r.wildUnaffected, "Un coup dans la confusion ne doit pas toucher l'adversaire");
      assert(r.selfDmg === r.expectedSelfDmg, `Dégâts auto-infligés attendus ${r.expectedSelfDmg}, obtenu ${r.selfDmg}`);
    }
  }
];
