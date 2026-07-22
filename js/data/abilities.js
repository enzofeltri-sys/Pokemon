// Talents (capacités passives). Sous-ensemble limité et lisible, un talent
// par espèce. Assignation par défaut selon le type principal, avec des
// exceptions pour les cas emblématiques (voir ABILITY_OVERRIDES).
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
  immunite:     { name: "Immunité",      desc: "Ne peut jamais être empoisonné." }
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
