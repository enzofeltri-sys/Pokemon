// Modèle de données: Pokémon possédé, équipe du joueur, XP / niveaux.
window.PKMN = window.PKMN || {};

// Stats calculées à partir des stats de base et du niveau (formule simplifiée,
// volontairement plus simple que la formule officielle IV/EV).
PKMN.calcStats = function (baseStats, level) {
  const s = {};
  s.hp = Math.floor((baseStats.hp * level) / 50) + level + 10;
  s.atk = Math.floor((baseStats.atk * level) / 50) + 5;
  s.def = Math.floor((baseStats.def * level) / 50) + 5;
  s.spa = Math.floor((baseStats.spa * level) / 50) + 5;
  s.spd = Math.floor((baseStats.spd * level) / 50) + 5;
  s.spe = Math.floor((baseStats.spe * level) / 50) + 5;
  return s;
};

PKMN.xpToNextLevel = function (level) {
  return Math.floor(20 * Math.pow(level, 1.6));
};

PKMN.createPokemon = function (speciesId, level) {
  const species = PKMN.POKEDEX[speciesId];
  const stats = PKMN.calcStats(species.baseStats, level);
  return {
    species: speciesId,
    level,
    xp: 0,
    hp: stats.hp,
    maxHp: stats.hp,
    stats,
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
  const newStats = PKMN.calcStats(newSpecies.baseStats, mon.level);
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
    const newStats = PKMN.calcStats(species.baseStats, mon.level);
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
  mapKey: null,
  x: 0,
  y: 0,
  facing: "down",

  initBag() {
    this.bag = { pierre_feu: 2, pierre_eau: 2, pierre_foudre: 2, pierre_plante: 2, pierre_lune: 3 };
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
