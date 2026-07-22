// Objets utilisables sur un Pokémon du parti (pierres d'évolution).
window.PKMN = window.PKMN || {};

PKMN.ITEMS = {
  pierre_feu: { name: "Pierre Feu" },
  pierre_eau: { name: "Pierre Eau" },
  pierre_foudre: { name: "Pierre Foudre" },
  pierre_plante: { name: "Pierre Plante" },
  pierre_lune: { name: "Pierre Lune" }
};

// Évoli est un cas particulier: une même espèce évolue différemment
// selon la pierre utilisée.
PKMN.EEVEE_ID = 133;
PKMN.EEVEE_STONE_EVOS = {
  pierre_feu: 136,   // Pyroli
  pierre_eau: 134,   // Aquali
  pierre_foudre: 135 // Voltali
};
