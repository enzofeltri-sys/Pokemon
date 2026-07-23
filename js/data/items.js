// Objets utilisables sur un Pokémon du parti (pierres d'évolution).
window.PKMN = window.PKMN || {};

PKMN.ITEMS = {
  pierre_feu: { name: "Pierre Feu" },
  pierre_eau: { name: "Pierre Eau" },
  pierre_foudre: { name: "Pierre Foudre" },
  pierre_plante: { name: "Pierre Plante" },
  pierre_lune: { name: "Pierre Lune" },
  pierre_soleil: { name: "Pierre Soleil" },
  pierre_royale: { name: "Pierre Royale" },
  pokeball: { name: "Poké Ball", price: 200, category: "ball", ballMultiplier: 1 },
  superball: { name: "Super Ball", price: 600, category: "ball", ballMultiplier: 1.5 },
  hyperball: { name: "Hyper Ball", price: 1200, category: "ball", ballMultiplier: 2 },
  potion: { name: "Potion", price: 300, category: "heal", healAmount: 20 },
  antidote: { name: "Antidote", price: 100, category: "cure" },
  revive: { name: "Rappel", price: 1500, category: "revive" },
  repel: { name: "Répulsif", price: 350, category: "repel", steps: 100 },
  baie_oran: { name: "Baie Oran", price: 250, category: "heldberry", cures: "hp", healAmount: 20 },
  baie_pecha: { name: "Baie Pecha", price: 150, category: "heldberry", cures: "poison" },
  baie_chesto: { name: "Baie Chesto", price: 150, category: "heldberry", cures: "sleep" },
  baie_persil: { name: "Baie Persil", price: 150, category: "heldberry", cures: "paralysis" }
};

PKMN.MART_STOCK = ["pokeball", "superball", "hyperball", "potion", "antidote", "revive", "repel", "baie_oran", "baie_pecha", "baie_chesto", "baie_persil"];

// Certaines espèces évoluent différemment selon la pierre utilisée
// (au lieu du chemin d'évolution unique porté par species.evoLevel).
PKMN.BRANCH_STONE_EVOS = {
  133: { pierre_feu: 136, pierre_eau: 134, pierre_foudre: 135, pierre_soleil: 196, pierre_lune: 197 }, // Évoli -> Pyroli/Aquali/Voltali/Mentali/Noctali
  44: { pierre_plante: 45, pierre_soleil: 182 },  // Ortide -> Rafflesia/Joliflor
  61: { pierre_eau: 62, pierre_royale: 186 },     // Têtarte -> Tartard/Tarpaud
  79: { pierre_royale: 199 }                      // Ramoloss -> Roigada (en plus de l'évolution par niveau)
};
