// Modèle de données: Pokémon possédé, équipe du joueur, XP / niveaux.
window.PKMN = window.PKMN || {};

// Stats calculées avec la vraie formule des jeux (IV 0-31, EV 0-252/stat,
// max 510 au total), sans nature (neutre pour tout le monde).
PKMN.calcStats = function (baseStats, level, ivs, evs) {
  ivs = ivs || PKMN.zeroIVs();
  evs = evs || PKMN.zeroEVs();
  const s = {};
  s.hp = Math.floor((2 * baseStats.hp + ivs.hp + Math.floor(evs.hp / 4)) * level / 100) + level + 10;
  for (const key of ["atk", "def", "spa", "spd", "spe"]) {
    s[key] = Math.floor((2 * baseStats[key] + ivs[key] + Math.floor(evs[key] / 4)) * level / 100) + 5;
  }
  return s;
};

PKMN.zeroIVs = function () { return { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }; };
PKMN.zeroEVs = function () { return { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }; };
PKMN.randomIVs = function () {
  const iv = () => Math.floor(Math.random() * 32);
  return { hp: iv(), atk: iv(), def: iv(), spa: iv(), spd: iv(), spe: iv() };
};

// Ajoute des EV (plafond 252/stat, 510 au total) et recalcule les stats.
PKMN.addEVs = function (mon, yieldObj) {
  if (!yieldObj) return;
  let total = Object.values(mon.evs).reduce((a, b) => a + b, 0);
  for (const stat in yieldObj) {
    if (total >= 510) break;
    const room = Math.max(0, Math.min(252 - mon.evs[stat], 510 - total, yieldObj[stat]));
    mon.evs[stat] += room;
    total += room;
  }
  const species = PKMN.speciesOf(mon);
  const newStats = PKMN.calcStats(species.baseStats, mon.level, mon.ivs, mon.evs);
  const hpGain = newStats.hp - mon.stats.hp;
  mon.stats = newStats;
  mon.maxHp = newStats.hp;
  if (hpGain > 0) mon.hp = Math.min(mon.maxHp, mon.hp + hpGain);
};

// Courbe linéaire volontairement généreuse: le ratio gain/besoin reste
// stable à tous les niveaux (~2-4 victoires par niveau), contrairement à une
// courbe exponentielle qui rend la montée de niveau de plus en plus lente.
PKMN.xpToNextLevel = function (level) {
  return 20 * level + 30;
};

PKMN.createPokemon = function (speciesId, level) {
  const species = PKMN.POKEDEX[speciesId];
  const ivs = PKMN.randomIVs();
  const evs = PKMN.zeroEVs();
  const stats = PKMN.calcStats(species.baseStats, level, ivs, evs);
  return {
    species: speciesId,
    level,
    xp: 0,
    hp: stats.hp,
    maxHp: stats.hp,
    stats,
    ivs,
    evs,
    moves: PKMN.movesAtLevel(speciesId, level).map((key) => ({ key, pp: PKMN.MOVES[key].pp, maxPp: PKMN.MOVES[key].pp })),
    statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    status: null,
    caughtWith: "Poké Ball"
  };
};

PKMN.speciesOf = function (mon) {
  return PKMN.POKEDEX[mon.species];
};

function performEvolution(mon, newSpeciesId) {
  const fromName = PKMN.speciesOf(mon).name;
  const newSpecies = PKMN.POKEDEX[newSpeciesId];
  const newStats = PKMN.calcStats(newSpecies.baseStats, mon.level, mon.ivs, mon.evs);
  const ratio = mon.hp / mon.maxHp;
  mon.species = newSpeciesId;
  mon.stats = newStats;
  mon.maxHp = newStats.hp;
  mon.hp = Math.max(1, Math.round(newStats.hp * ratio));
  return { evolved: true, from: fromName, to: newSpecies.name };
}

// Évolution par niveau (renvoie {evolved:false} si aucune évolution de ce type n'est due).
PKMN.tryEvolve = function (mon) {
  const species = PKMN.speciesOf(mon);
  if (typeof species.evoLevel === "number" && mon.level >= species.evoLevel && species.evoId) {
    return performEvolution(mon, species.evoId);
  }
  return { evolved: false };
};

// Évolution par pierre. `stoneKey` ex: "pierre_feu". Renvoie {evolved:false} si la pierre
// ne fait rien sur ce Pokémon.
PKMN.tryEvolveWithStone = function (mon, stoneKey) {
  if (mon.species === PKMN.EEVEE_ID) {
    const targetId = PKMN.EEVEE_STONE_EVOS[stoneKey];
    if (targetId) return performEvolution(mon, targetId);
    return { evolved: false };
  }
  const species = PKMN.speciesOf(mon);
  if (species.evoLevel === stoneKey && species.evoId) {
    return performEvolution(mon, species.evoId);
  }
  return { evolved: false };
};

PKMN.gainExp = function (mon, amount) {
  const messages = [];
  mon.xp += amount;
  let needed = PKMN.xpToNextLevel(mon.level);
  while (mon.xp >= needed && mon.level < 100) {
    mon.xp -= needed;
    mon.level++;
    const species = PKMN.speciesOf(mon);
    const newStats = PKMN.calcStats(species.baseStats, mon.level, mon.ivs, mon.evs);
    const hpGain = newStats.hp - mon.stats.hp;
    mon.stats = newStats;
    mon.maxHp = newStats.hp;
    mon.hp = Math.min(mon.maxHp, mon.hp + hpGain);
    messages.push(`${species.name} monte au niveau ${mon.level} !`);

    const learned = (PKMN.LEARNSETS[mon.species] || []).filter(([lvl]) => lvl === mon.level);
    for (const [, moveKey] of learned) {
      if (mon.moves.find((m) => m.key === moveKey)) continue;
      const newMove = { key: moveKey, pp: PKMN.MOVES[moveKey].pp, maxPp: PKMN.MOVES[moveKey].pp };
      if (mon.moves.length < 4) {
        mon.moves.push(newMove);
        messages.push(`${species.name} apprend ${PKMN.MOVES[moveKey].name} !`);
      } else {
        const forgotten = mon.moves.shift();
        mon.moves.push(newMove);
        messages.push(`${species.name} oublie ${PKMN.MOVES[forgotten.key].name} et apprend ${PKMN.MOVES[moveKey].name} !`);
      }
    }

    const evo = PKMN.tryEvolve(mon);
    if (evo.evolved) messages.push(`${evo.from} évolue en ${evo.to} !`);
    needed = PKMN.xpToNextLevel(mon.level);
  }
  return messages;
};

PKMN.healParty = function (party) {
  for (const mon of party) {
    mon.hp = mon.maxHp;
    mon.status = null;
    for (const m of mon.moves) m.pp = m.maxPp;
  }
};

PKMN.Player = {
  party: [],
  pokedexSeen: new Set(),
  pokedexCaught: new Set(),
  bag: {},
  money: 0,
  mapKey: null,
  x: 0,
  y: 0,
  facing: "down",

  initBag() {
    this.bag = { pierre_feu: 2, pierre_eau: 2, pierre_foudre: 2, pierre_plante: 2, pierre_lune: 3, pokeball: 5, potion: 3 };
    this.money = 500;
  },

  addToParty(speciesId, level) {
    const mon = PKMN.createPokemon(speciesId, level);
    if (this.party.length < 6) this.party.push(mon);
    this.pokedexCaught.add(speciesId);
    this.pokedexSeen.add(speciesId);
    return mon;
  },

  firstAlive() {
    return this.party.find((m) => m.hp > 0) || null;
  },

  isPartyWiped() {
    return this.party.every((m) => m.hp <= 0);
  }
};
