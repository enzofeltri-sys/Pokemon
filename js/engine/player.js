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

// Courbe fidèle au groupe "Moyenne Rapide" des vrais jeux (XP cumulé = niveau^3).
// XP nécessaire pour passer de `level` à `level+1` = (level+1)^3 - level^3.
// Ça grimpe fort avec le niveau: atteindre le niveau 100 est un vrai objectif
// long terme, pas juste quelques combats de plus.
PKMN.xpToNextLevel = function (level) {
  return Math.pow(level + 1, 3) - Math.pow(level, 3);
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
    statStages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 },
    status: null,
    statusCounter: 0,
    confused: 0,
    mustRecharge: false,
    flinched: false,
    heldItem: null,
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

// Applique un objet consommable (potion/antidote/rappel/pierre) à un Pokémon donné et
// renvoie le message à afficher. Partagé par le Sac et le bouton Objet rapide.
PKMN.applyItemToMon = function (key, mon) {
  const species = PKMN.speciesOf(mon);
  if (key.startsWith("pierre_")) {
    const result = PKMN.tryEvolveWithStone(mon, key);
    if (result.evolved) { PKMN.Player.bag[key]--; return `${result.from} évolue en ${result.to} !`; }
    return "Ça n'a aucun effet...";
  }
  if (key === "potion") {
    if (mon.hp <= 0) return "Ce Pokémon est K.O. !";
    if (mon.hp >= mon.maxHp) return "Les PV sont déjà au maximum !";
    mon.hp = Math.min(mon.maxHp, mon.hp + PKMN.ITEMS.potion.healAmount);
    PKMN.Player.bag.potion--;
    return `${species.name} récupère des PV !`;
  }
  if (key === "antidote") {
    if (mon.status !== "poison" && mon.status !== "toxic") return "Ça n'aurait aucun effet !";
    mon.status = null;
    mon.statusCounter = 0;
    PKMN.Player.bag.antidote--;
    return `${species.name} est soigné du poison !`;
  }
  if (key === "revive") {
    if (mon.hp > 0) return "Ce Pokémon n'est pas K.O. !";
    mon.hp = Math.max(1, Math.floor(mon.maxHp / 2));
    PKMN.Player.bag.revive--;
    return `${species.name} est ranimé !`;
  }
  return "Ça n'a aucun effet...";
};

PKMN.healParty = function (party) {
  for (const mon of party) {
    mon.hp = mon.maxHp;
    mon.status = null;
    mon.statusCounter = 0;
    mon.confused = 0;
    mon.mustRecharge = false;
    for (const m of mon.moves) m.pp = m.maxPp;
  }
};

PKMN.Player = {
  party: [],
  box: [],
  pokedexSeen: new Set(),
  pokedexCaught: new Set(),
  bag: {},
  money: 0,
  mapKey: null,
  x: 0,
  y: 0,
  facing: "down",
  lastCenter: null,
  repelSteps: 0,
  flags: {},
  quests: {},
  moral: { loyaute: 0, ambition: 0, methode: 0 },
  options: { multiExp: true },
  quickItem: null,

  initBag() {
    this.bag = { pierre_feu: 2, pierre_eau: 2, pierre_foudre: 2, pierre_plante: 2, pierre_lune: 3, pokeball: 5, potion: 3 };
    this.money = 500;
  },

  getFlag(key) {
    return this.flags[key];
  },

  setFlag(key, value) {
    this.flags[key] = value === undefined ? true : value;
  },

  // Compteur générique "a parlé N fois à ce PNJ" (utile pour les récompenses cachées).
  incTalkCount(npcId) {
    const k = `talk_${npcId}`;
    this.flags[k] = (this.flags[k] || 0) + 1;
    return this.flags[k];
  },

  startQuest(id) {
    if (!this.quests[id]) this.quests[id] = { status: "active", step: 0 };
  },

  setQuestStep(id, step) {
    if (this.quests[id]) this.quests[id].step = step;
  },

  completeQuest(id) {
    this.quests[id] = { status: "done", step: (this.quests[id] && this.quests[id].step) || 0 };
  },

  questStatus(id) {
    return this.quests[id] ? this.quests[id].status : "not_started";
  },

  adjustMoral(axis, delta) {
    this.moral[axis] = (this.moral[axis] || 0) + delta;
  },

  addToParty(speciesId, level) {
    const mon = PKMN.createPokemon(speciesId, level);
    if (this.party.length < 6) this.party.push(mon);
    else this.box.push(mon);
    this.pokedexCaught.add(speciesId);
    this.pokedexSeen.add(speciesId);
    return mon;
  },

  // Ajoute un Pokémon capturé à l'équipe si elle a de la place, sinon à la Boîte PC.
  // Renvoie true si envoyé en boîte.
  addCaught(mon) {
    this.pokedexCaught.add(mon.species);
    this.pokedexSeen.add(mon.species);
    if (this.party.length < 6) { this.party.push(mon); return false; }
    this.box.push(mon);
    return true;
  },

  releaseFromParty(index) {
    if (this.party.length <= 1) return false;
    this.party.splice(index, 1);
    return true;
  },

  releaseFromBox(index) {
    this.box.splice(index, 1);
  },

  depositToBox(index) {
    if (this.party.length <= 1) return false;
    const [mon] = this.party.splice(index, 1);
    this.box.push(mon);
    return true;
  },

  withdrawFromBox(index) {
    if (this.party.length >= 6) return false;
    const [mon] = this.box.splice(index, 1);
    this.party.push(mon);
    return true;
  },

  firstAlive() {
    return this.party.find((m) => m.hp > 0) || null;
  },

  isPartyWiped() {
    return this.party.every((m) => m.hp <= 0);
  }
};
