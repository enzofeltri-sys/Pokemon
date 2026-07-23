// Table d'efficacité des types (17 types, ère Gen II-V, sans Fée)
// TYPE_CHART[attaquant][defenseur] = multiplicateur (par défaut 1 si absent)
window.PKMN = window.PKMN || {};

PKMN.TYPES = [
  "normal", "feu", "eau", "electrik", "plante", "glace", "combat", "poison",
  "sol", "vol", "psy", "insecte", "roche", "spectre", "dragon", "tenebres", "acier"
];

PKMN.TYPE_COLORS = {
  normal: "#A8A878", feu: "#F08030", eau: "#6890F0", electrik: "#F8D030",
  plante: "#78C850", glace: "#98D8D8", combat: "#C03028", poison: "#A040A0",
  sol: "#E0C068", vol: "#A890F0", psy: "#F85888", insecte: "#A8B820",
  roche: "#B8A038", spectre: "#705898", dragon: "#7038F8", tenebres: "#705848",
  acier: "#B8B8D0"
};

// Libellé court affiché sur les badges de type (voir PKMN.drawTypeBadge).
PKMN.TYPE_LABELS = {
  normal: "NORMAL", feu: "FEU", eau: "EAU", electrik: "ÉLEC",
  plante: "PLANTE", glace: "GLACE", combat: "COMBAT", poison: "POISON",
  sol: "SOL", vol: "VOL", psy: "PSY", insecte: "INSECTE",
  roche: "ROCHE", spectre: "SPECTRE", dragon: "DRAGON", tenebres: "TÉNÈBRES",
  acier: "ACIER"
};

PKMN.TYPE_CHART = {
  normal:   { roche: 0.5, spectre: 0, acier: 0.5 },
  feu:      { feu: 0.5, eau: 0.5, plante: 2, glace: 2, insecte: 2, roche: 0.5, dragon: 0.5, acier: 2 },
  eau:      { feu: 2, eau: 0.5, plante: 0.5, sol: 2, roche: 2, dragon: 0.5 },
  electrik: { eau: 2, electrik: 0.5, plante: 0.5, sol: 0, vol: 2, dragon: 0.5 },
  plante:   { feu: 0.5, eau: 2, plante: 0.5, poison: 0.5, sol: 2, vol: 0.5, insecte: 0.5, roche: 2, dragon: 0.5, acier: 0.5 },
  glace:    { feu: 0.5, eau: 0.5, plante: 2, glace: 0.5, sol: 2, vol: 2, dragon: 2, acier: 0.5 },
  combat:   { normal: 2, glace: 2, poison: 0.5, vol: 0.5, psy: 0.5, insecte: 0.5, roche: 2, spectre: 0, tenebres: 2, acier: 2 },
  poison:   { plante: 2, poison: 0.5, sol: 0.5, roche: 0.5, spectre: 0.5, acier: 0 },
  sol:      { feu: 2, electrik: 2, plante: 0.5, poison: 2, vol: 0, insecte: 0.5, roche: 2, acier: 2 },
  vol:      { electrik: 0.5, plante: 2, combat: 2, insecte: 2, roche: 0.5, acier: 0.5 },
  psy:      { combat: 2, poison: 2, psy: 0.5, tenebres: 0, acier: 0.5 },
  insecte:  { feu: 0.5, plante: 2, combat: 0.5, poison: 0.5, vol: 0.5, psy: 2, spectre: 0.5, tenebres: 2, acier: 0.5 },
  roche:    { feu: 2, glace: 2, combat: 0.5, sol: 0.5, vol: 2, insecte: 2, acier: 0.5 },
  spectre:  { normal: 0, psy: 2, spectre: 2, tenebres: 0.5 },
  dragon:   { dragon: 2, acier: 0.5 },
  tenebres: { combat: 0.5, psy: 2, spectre: 2, tenebres: 0.5 },
  acier:    { feu: 0.5, eau: 0.5, electrik: 0.5, glace: 2, roche: 2, acier: 0.5 }
};

PKMN.getEffectiveness = function (attackType, defTypes) {
  let mult = 1;
  for (const d of defTypes) {
    const row = PKMN.TYPE_CHART[attackType];
    if (row && Object.prototype.hasOwnProperty.call(row, d)) {
      mult *= row[d];
    }
  }
  return mult;
};

// Pour un ou deux types défenseurs, classe chaque type attaquant par
// multiplicateur reçu (x4/x2 faible, x0.5/x0.25 résistant, x0 immunisé).
PKMN.typeMatchups = function (defTypes) {
  const groups = { weak4: [], weak2: [], resist2: [], resist4: [], immune: [] };
  for (const atk of PKMN.TYPES) {
    const mult = PKMN.getEffectiveness(atk, defTypes);
    if (mult === 0) groups.immune.push(atk);
    else if (mult === 4) groups.weak4.push(atk);
    else if (mult === 2) groups.weak2.push(atk);
    else if (mult === 0.5) groups.resist2.push(atk);
    else if (mult === 0.25) groups.resist4.push(atk);
  }
  return groups;
};
