// Talents (capacités passives). Chaque espèce a désormais un petit pool de
// talents possibles (2 talents normaux + 1 talent caché, plus rare) au lieu
// d'un talent unique fixe: PKMN.rollAbility tire, à la création d'un Pokémon
// donné, lequel de ces talents il porte réellement (voir js/party/player.js).
// Assignation des pools par défaut selon le type, avec des exceptions pour
// les cas emblématiques (voir ABILITY_OVERRIDES).
window.PKMN = window.PKMN || {};

PKMN.ABILITIES = {
  brasier:      { name: "Brasier",       desc: "Capacités Feu +50% sous 1/3 des PV max." },
  torrent:      { name: "Torrent",       desc: "Capacités Eau +50% sous 1/3 des PV max." },
  engrais:      { name: "Engrais",       desc: "Capacités Plante +50% sous 1/3 des PV max." },
  statik:       { name: "Statik",        desc: "30% de paralyser l'attaquant en cas de contact." },
  point_poison: { name: "Point Poison",  desc: "30% d'empoisonner l'attaquant en cas de contact." },
  levitation:   { name: "Lévitation",    desc: "Immunisé aux capacités de type Sol." },
  insomniaque:  { name: "Insomniaque",   desc: "Ne peut jamais s'endormir." },
  abnegation:   { name: "Abnégation",    desc: "Attaque +50% si affecté par un statut (brûlure non pénalisante)." },
  fermete:      { name: "Fermeté",       desc: "Survit toujours à 1 PV face à une attaque à PV pleins." },
  pression:     { name: "Pression",      desc: "Les capacités adverses coûtent 2 PP au lieu d'1." },
  tempo_perso:  { name: "Tempo Perso",   desc: "Ne peut jamais être confus." },
  immunite:     { name: "Immunité",      desc: "Ne peut jamais être empoisonné." },
  adaptabilite: { name: "Adaptabilité",  desc: "Bonus STAB renforcé (attaques du même type que le porteur)." },
  peau_dure:    { name: "Peau Dure",     desc: "Réduit de 10% les dégâts des attaques physiques reçues." },
  corps_ardent: { name: "Corps Ardent",  desc: "30% de brûler l'attaquant en cas de contact." },
  prudence:     { name: "Prudence",      desc: "Ne peut jamais subir de coup critique." },
  coeur_de_glace:{ name: "Cœur de Glace", desc: "Ne peut jamais être gelé." },
  isolant:      { name: "Isolant",       desc: "Immunisé aux capacités de type Électrik." }
};

PKMN.TYPE_DEFAULT_ABILITY = {
  plante: "engrais",
  feu: "brasier",
  eau: "torrent",
  electrik: "statik",
  poison: "point_poison",
  sol: "fermete",
  roche: "fermete",
  combat: "abnegation",
  spectre: "levitation",
  acier: "fermete",
  glace: "insomniaque",
  insecte: "pression",
  vol: "tempo_perso",
  psy: "insomniaque",
  tenebres: "pression",
  dragon: "fermete",
  normal: "tempo_perso"
};

// Exceptions emblématiques (id espèce -> talent), quand le défaut par type
// serait trop éloigné du vrai jeu.
PKMN.ABILITY_OVERRIDES = {
  23: "point_poison", 24: "point_poison",      // Abo/Arbok (Intimidation existe aussi en vrai, on garde simple)
  58: "point_poison", 59: "point_poison",       // Caninos/Arcanin -> remplacé plus bas
  81: "levitation", 82: "levitation",           // Magnéti/Magnéton
  109: "levitation", 110: "levitation",         // Smogo/Smogogo
  113: "immunite",                              // Leveinard
  143: "immunite",                              // Ronflex
  128: "point_poison"                           // placeholder, remplacé plus bas
};

// Intimidation (baisse l'Attaque adverse à l'envoi) pour les cas les plus connus.
PKMN.INTIMIDATE_SPECIES = new Set([58, 59, 130, 128, 23, 24]);
for (const id of PKMN.INTIMIDATE_SPECIES) PKMN.ABILITY_OVERRIDES[id] = "intimidation";
PKMN.ABILITIES.intimidation = { name: "Intimidation", desc: "Baisse l'Attaque adverse d'un palier à l'envoi." };

// Second talent normal par défaut selon le type principal, utilisé quand le
// type secondaire ne fournit pas d'alternative utile (voir pokedex.js).
PKMN.SECONDARY_ABILITY_POOL = [
  "statik", "point_poison", "levitation", "insomniaque", "abnegation",
  "fermete", "pression", "tempo_perso", "immunite", "brasier", "torrent", "engrais"
];

// Talent caché par type: plus rare, tiré d'un pool distinct des talents
// normaux pour ne jamais entrer en collision avec eux.
PKMN.TYPE_HIDDEN_ABILITY = {
  normal: "adaptabilite",
  feu: "corps_ardent",
  eau: "prudence",
  electrik: "isolant",
  plante: "peau_dure",
  glace: "coeur_de_glace",
  combat: "adaptabilite",
  poison: "corps_ardent",
  sol: "peau_dure",
  vol: "prudence",
  psy: "adaptabilite",
  insecte: "peau_dure",
  roche: "peau_dure",
  spectre: "prudence",
  dragon: "adaptabilite",
  tenebres: "corps_ardent",
  acier: "peau_dure"
};

// Chance qu'un Pokémon donné porte son talent caché plutôt qu'un des deux
// talents normaux de son espèce (comme dans les jeux originaux, c'est rare).
PKMN.HIDDEN_ABILITY_CHANCE = 0.08;

// Tire le talent réellement porté par CE Pokémon (pas juste son espèce),
// parmi le pool { normal: [a, b], hidden: h } calculé pour son espèce dans
// pokedex.js. Renvoie { key, slot } où slot vaut 0, 1 ou "hidden" — conservé
// sur le Pokémon pour qu'une évolution redonne le même "type" de talent
// (le talent cache reste caché après évolution) plutôt que d'en retirer un
// au hasard à chaque évolution.
PKMN.rollAbility = function (speciesId, slot) {
  const pool = PKMN.POKEDEX[speciesId] && PKMN.POKEDEX[speciesId].abilities;
  if (!pool) return { key: "tempo_perso", slot: 0 };
  if (slot === undefined) {
    slot = Math.random() < PKMN.HIDDEN_ABILITY_CHANCE ? "hidden" : Math.floor(Math.random() * pool.normal.length);
  }
  if (slot === "hidden") return { key: pool.hidden, slot: "hidden" };
  const resolvedSlot = pool.normal[slot] !== undefined ? slot : 0;
  return { key: pool.normal[resolvedSlot], slot: resolvedSlot };
};
